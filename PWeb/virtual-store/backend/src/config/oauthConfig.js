// ===== CONFIGURACIÓN DISCORD OAUTH2 API =====
// Archivo de configuración centralizada para la integración con Discord OAuth2
module.exports = {
    // ID de cliente de la aplicación Discord (público)
    DISCORD_CLIENT_ID: 'tu_discord_id_aqui',
    // Secreto de cliente Discord (CONFIDENCIAL - usado para autenticación del servidor)
    DISCORD_CLIENT_SECRET: 'tu_discord_secret_aqui',
    // URL donde Discord redirige después de autorización exitosa
    DISCORD_REDIRECT_URI: 'http://localhost:5000/auth/discord/callback',
    // Permisos solicitados a Discord (identificación y email del usuario)
    DISCORD_SCOPE: ['identify', 'email'],
};