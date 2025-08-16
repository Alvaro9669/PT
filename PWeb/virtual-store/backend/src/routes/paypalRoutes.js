const express = require('express');
// ===== IMPORTACIÓN PAYPAL SDK =====
const paypal = require('@paypal/checkout-server-sdk'); // SDK oficial de PayPal
const router = express.Router();
const client = require('../models/paypal'); // Cliente PayPal configurado
const pool = require('../config/database');
const Ticket = require('../models/ticket');

// Ruta para capturar una orden de PayPal y procesar la compra
router.post('/capture-order', async (req, res) => {
    const { orderId, total } = req.body; // ID de la orden de PayPal y total de la compra
    console.log('Total recibido desde el frontend:', total);

    // ===== CREACIÓN DE SOLICITUD PAYPAL API =====
    // Crear solicitud de captura usando el SDK de PayPal
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({}); // Cuerpo vacío para captura simple

    // Validar que el total sea un número válido
    if (!total || isNaN(total)) {
        console.error('El total es inválido o no se recibió.');
        return res.status(400).json({ success: false, message: 'El total es inválido o no se recibió.' });
    }
    
    try {
        // ===== LLAMADA A PAYPAL API - CAPTURA DE ORDEN =====
        // Ejecutar la captura de la orden en PayPal usando su API
        const capture = await client.execute(request);
        const order = capture.result;

        // Verificar que el pago se completó exitosamente en PayPal
        if (order.status === 'COMPLETED') {
            // Obtener información del usuario desde las cookies
            const userCookie = req.cookies.user;
            if (!userCookie) {
                console.error('No se encontró la cookie del usuario.');
                return res.status(401).json({ success: false, message: 'No se encontró la cookie del usuario.' });
            }

            const user = JSON.parse(userCookie);
            const discordId = user.id;

            // Buscar el ID del usuario en la base de datos usando su Discord ID
            const [rows] = await pool.query('SELECT ID_usuarios FROM usuarios WHERE discord_id = ?', [discordId]);
            if (rows.length === 0) {
                console.error('No se encontró un usuario para el Discord ID:', discordId);
                return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
            }

            const userId = rows[0].ID_usuarios;

            // Crear el ticket de compra usando el modelo Ticket
            const ticketId = await Ticket.create(userId, total);

            res.json({ success: true, message: 'Pago completado exitosamente y ticket creado.', ticketId });
        } else {
            console.warn('El estado de la orden no es COMPLETED:', order.status);
            res.status(400).json({ success: false, message: 'El pago no se completó.' });
        }
    } catch (error) {
        // ===== MANEJO DE ERRORES PAYPAL API =====
        console.error('Error al capturar el pago:', error);
        res.status(500).json({ success: false, message: 'Error al capturar el pago.' });
    }
});

module.exports = router;