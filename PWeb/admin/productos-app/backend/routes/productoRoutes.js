const express = require('express');
const { createProducto } = require('../controllers/productoController');

const router = express.Router();

// Ruta para crear un nuevo producto
router.post('/', createProducto);

module.exports = router;