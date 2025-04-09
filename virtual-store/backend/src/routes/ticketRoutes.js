const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');

// Obtener todos los tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.getAll();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo ticket
router.post('/', async (req, res) => {
    try {
        const { userId, total } = req.body;
        const ticketId = await Ticket.create(userId, total);
        res.status(201).json({ ticketId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener un ticket por ID
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.getById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;