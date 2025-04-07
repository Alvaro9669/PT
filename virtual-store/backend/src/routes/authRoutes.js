const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para iniciar sesión con Discord
router.get('/login', (req, res) => authController.login(req, res));

// Ruta para manejar el callback de Discord
router.get('/discord/callback', (req, res) => authController.callback(req, res));

// Ruta para obtener la información del usuario autenticado
router.get('/user', (req, res) => {
    res.set('Cache-Control', 'no-store'); // Deshabilitar el almacenamiento en caché

    const userCookie = req.cookies.user;
    if (!userCookie) {
        return res.status(401).send('Not authenticated');
    }

    try {
        const user = JSON.parse(userCookie);
        res.json(user);
    } catch (error) {
        res.status(400).send('Invalid cookie format');
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('user'); // Eliminar la cookie del usuario
    res.status(200).send('Logged out successfully');
});
module.exports = router;