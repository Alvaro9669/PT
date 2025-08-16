const axios = require('axios');
const pool = require('../config/database');
const crypto = require('crypto');
require('dotenv').config();

class AuthController {
    constructor() {
        // ===== CONFIGURACIÓN ENDPOINTS DISCORD API =====
        // URL para iniciar flujo OAuth2 con Discord
        this.discordOAuth2URL = 'https://discord.com/api/oauth2/authorize';
        // Endpoint para intercambiar código por token de acceso
        this.tokenURL = 'https://discord.com/api/oauth2/token';
        // Endpoint para obtener información del usuario autenticado
        this.userInfoURL = 'https://discord.com/api/users/@me';
        this.redirectURI = process.env.DISCORD_REDIRECT_URI;
        this.clientID = process.env.DISCORD_CLIENT_ID;
        this.clientSecret = process.env.DISCORD_CLIENT_SECRET;
    }

    // Inicia el login con Discord
    login(req, res) {
        const scope = 'identify email'; // Permisos solicitados a Discord API
        const state = crypto.randomBytes(16).toString('hex'); // Previene ataques CSRF
        
        // Guarda el estado en una cookie temporal
        res.cookie('oauth_state', state, { 
            httpOnly: true, 
            secure: false,
            maxAge: 60000, // 1 minuto de expiración
            sameSite: 'lax'
        });

        // ===== LLAMADA A DISCORD API - AUTORIZACIÓN =====
        // Construye URL de autorización para redirigir al usuario a Discord
        const url = `${this.discordOAuth2URL}?client_id=${this.clientID}&redirect_uri=${encodeURIComponent(this.redirectURI)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
        res.redirect(url);
    }

    // Maneja el callback de Discord después de la autorización
    async callback(req, res) {
        console.log('Authorization code received:', req.query.code);
        if (req.query.error) {
            // Si hay error, redirige al frontend
            console.warn('Discord authorization error:', req.query.error);
            return res.redirect(`${process.env.FRONTEND_URL}/`);
        }

        const { code, state } = req.query;
        const savedState = req.cookies.oauth_state;

        // Verifica el estado para evitar CSRF
        if (!code || !state || state !== savedState) {
            return res.status(400).redirect(`${process.env.FRONTEND_URL}/`);
        }

        res.clearCookie('oauth_state'); // Limpia la cookie de estado

        try {
            // ===== LLAMADA A DISCORD API - INTERCAMBIO DE TOKEN =====
            // Intercambia el código de autorización por un token de acceso
            const tokenResponse = await axios.post(this.tokenURL, new URLSearchParams({
                client_id: this.clientID,
                client_secret: this.clientSecret,
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.redirectURI,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const accessToken = tokenResponse.data.access_token;

            // ===== LLAMADA A DISCORD API - INFORMACIÓN DEL USUARIO =====
            // Obtiene la información del usuario desde Discord usando el token
            const userResponse = await axios.get(this.userInfoURL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Autenticación con Discord API
                },
            });

            const userData = userResponse.data;
            // Busca el usuario en la base de datos, si no existe lo crea
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE discord_id = ?', [userData.id]);

            if (rows.length === 0) {
                // Inserta nuevo usuario
                await pool.query(
                    'INSERT INTO usuarios (discord_id, correo, imagen, n_usuario) VALUES (?, ?, ?, ?)',
                    [userData.id, userData.email, userData.avatar, userData.username]
                );
            } else {
                // Actualiza datos del usuario existente
                await pool.query(
                    'UPDATE usuarios SET correo = ?, imagen = ?, n_usuario = ? WHERE discord_id = ?',
                    [userData.email, userData.avatar, userData.username, userData.id]
                );
            }
            // Crea la cookie de sesión del usuario con datos de Discord
            const userPayload = {
                id: userData.id,
                username: userData.global_name || userData.username,
                // ===== USO DE DISCORD CDN API =====
                // Construye URLs de avatar usando el CDN de Discord
                avatar: userData.avatar
                    ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/${userData.discriminator % 5}.png`,
                email: userData.email,
            };
            console.log('User payload for cookie:', userPayload); // Verifica el contenido de la cookie
            res.cookie('user', JSON.stringify(userPayload), { 
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000, // 1 día
                sameSite: 'lax'
            });
            // Redirige al frontend después de autenticación exitosa
            res.redirect(`${process.env.FRONTEND_URL}/`);
        } catch (error) {
            // Manejo de errores de autenticación con Discord API
            console.error('Error during Discord authentication:', error.response?.data || error.message);
            res.redirect(`${process.env.FRONTEND_URL}/`);
        }
    }

    // Cierra la sesión del usuario
    logout(req, res) {
        res.clearCookie('user', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
}

module.exports = new AuthController();