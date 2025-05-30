const express = require('express');
const router = express.Router();
const Producto = require('../models/productos');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.getAll();
        res.json(productos);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;