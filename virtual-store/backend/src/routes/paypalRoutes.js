const express = require('express');
const router = express.Router();
const client = require('../models/paypal');

// Crear una orden
router.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: amount
            }
        }]
    });

    try {
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        console.error('Error creando la orden:', error);
        res.status(500).send('Error creando la orden');
    }
});

// Capturar una orden
router.post('/capture-order', async (req, res) => {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        res.json(capture.result);
    } catch (error) {
        console.error('Error capturando la orden:', error);
        res.status(500).send('Error capturando la orden');
    }
});

module.exports = router;