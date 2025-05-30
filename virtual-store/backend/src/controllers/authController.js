const axios = require('axios');
const pool = require('../config/database');
const crypto = require('crypto');
require('dotenv').config();

class AuthController {
    constructor() {
        this.discordOAuth2URL = 'https://discord.com/api/oauth2/authorize';
        this.tokenURL = 'https://discord.com/api/oauth2/token';
        this.userInfoURL = 'https://discord.com/api/users/@me';
        this.redirectURI = process.env.DISCORD_REDIRECT_URI;
        this.clientID = process.env.DISCORD_CLIENT_ID;
        this.clientSecret = process.env.DISCORD_CLIENT_SECRET;
    }

    // Inicia el login con Discord
    login(req, res) {
        const scope = 'identify email';
        const state = crypto.randomBytes(16).toString('hex');
        
        res.cookie('oauth_state', state, { 
            httpOnly: true, 
            secure: false,
            maxAge: 60000, // 1 minuto de expiración
            sameSite: 'lax'
        });

        const url = `${this.discordOAuth2URL}?client_id=${this.clientID}&redirect_uri=${encodeURIComponent(this.redirectURI)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
        res.redirect(url);
    }

    // Maneja el callback de Discord
    async callback(req, res) {
        console.log('Authorization code received:', req.query.code);
        if (req.query.error) {
            console.warn('Discord authorization error:', req.query.error);
            return res.redirect(`${process.env.FRONTEND_URL}/`);
        }

        const { code, state } = req.query;
        const savedState = req.cookies.oauth_state;

        if (!code || !state || state !== savedState) {
            return res.status(400).redirect(`${process.env.FRONTEND_URL}/`);
        }

        res.clearCookie('oauth_state');

        try {
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

            // Obtener información del usuario desde Discord
            const userResponse = await axios.get(this.userInfoURL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userData = userResponse.data;
            // Guardar o actualizar el usuario en la base de datos
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE discord_id = ?', [userData.id]);

            if (rows.length === 0) {
                await pool.query(
                    'INSERT INTO usuarios (discord_id, correo, imagen, n_usuario) VALUES (?, ?, ?, ?)',
                    [userData.id, userData.email, userData.avatar, userData.username]
                );
            } else {
                await pool.query(
                    'UPDATE usuarios SET correo = ?, imagen = ?, n_usuario = ? WHERE discord_id = ?',
                    [userData.email, userData.avatar, userData.username, userData.id]
                );
            }
            // Crear la cookie del usuario
            const userPayload = {
                id: userData.id,
                username: userData.global_name || userData.username,
                avatar: userData.avatar
                    ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/${userData.discriminator % 5}.png`,
                email: userData.email,
            };
            console.log('User payload for cookie:', userPayload); // Verificar el contenido de la cookie
            res.cookie('user', JSON.stringify(userPayload), { 
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000, // 1 día
                sameSite: 'lax'
            });
            // Redirigir al frontend
            res.redirect(`${process.env.FRONTEND_URL}/`);
        } catch (error) {
            console.error('Error during Discord authentication:', error.response?.data || error.message);
            res.redirect(`${process.env.FRONTEND_URL}/`);
        }
    }

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