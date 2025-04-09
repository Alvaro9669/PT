const express = require('express');
const paypal = require('@paypal/checkout-server-sdk'); // Importa el SDK de PayPal
const router = express.Router();
const client = require('../models/paypal'); // Importa la configuración del cliente PayPal
const pool = require('../config/database'); // Ajusta la ruta según tu estructura de carpetas
const Ticket = require('../models/ticket'); // Importa el modelo de Ticket

// Capturar una orden
router.post('/capture-order', async (req, res) => {
    const { orderId, total } = req.body; // Recibir el total desde el frontend
    console.log('Total recibido desde el frontend:', total);


    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    if (!total || isNaN(total)) {
        console.error('El total es inválido o no se recibió.');
        return res.status(400).json({ success: false, message: 'El total es inválido o no se recibió.' });
    }
    try {
        const capture = await client.execute(request);
        const order = capture.result;

            if (order.status === 'COMPLETED') {
                // Obtener el ID del usuario desde la cookie
                const userCookie = req.cookies.user;
                if (!userCookie) {
                    console.error('No se encontró la cookie del usuario.');
                    return res.status(401).json({ success: false, message: 'No se encontró la cookie del usuario.' });
                }

                const user = JSON.parse(userCookie);
                const discordId = user.id;

                // Buscar el ID del usuario
                const [rows] = await pool.query('SELECT ID_usuarios FROM usuarios WHERE discord_id = ?', [discordId]);
                if (rows.length === 0) {
                    console.error('No se encontró un usuario para el Discord ID:', discordId);
                    return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
                }

                const userId = rows[0].ID_usuarios;

                // Crear el ticket usando el modelo
                const ticketId = await Ticket.create(userId, total); // Usar el total enviado desde el frontend

                res.json({ success: true, message: 'Pago completado exitosamente y ticket creado.', ticketId });
            } else {
                console.warn('El estado de la orden no es COMPLETED:', order.status);
                res.status(400).json({ success: false, message: 'El pago no se completó.' });
            }
        } catch (error) {
            console.error('Error al capturar el pago:', error);
            res.status(500).json({ success: false, message: 'Error al capturar el pago.' });
        }
    });

module.exports = router;