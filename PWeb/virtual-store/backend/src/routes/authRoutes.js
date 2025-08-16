const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ===== RUTAS DISCORD OAUTH2 API =====
// Ruta para iniciar sesión con Discord OAuth2
router.get('/login', (req, res) => authController.login(req, res));

// Ruta para manejar el callback de Discord OAuth2 después de autorización
router.get('/discord/callback', (req, res) => authController.callback(req, res));

// Ruta para obtener la información del usuario autenticado (desde cookie Discord)
router.get('/user', (req, res) => {
    res.set('Cache-Control', 'no-store'); // Deshabilita el almacenamiento en caché

    const userCookie = req.cookies.user;
    if (!userCookie) {
        return res.status(401).send('Not authenticated');
    }

    try {
        const user = JSON.parse(userCookie); // Datos del usuario de Discord
        res.json(user); // Devuelve los datos del usuario autenticado con Discord
    } catch (error) {
        res.status(400).send('Invalid cookie format');
    }
});

// Ruta para cerrar sesión (logout) y limpiar cookie Discord
router.post('/logout', (req, res) => {
    res.clearCookie('user'); // Elimina la cookie del usuario Discord
    res.status(200).send('Logged out successfully');
});
module.exports = router;