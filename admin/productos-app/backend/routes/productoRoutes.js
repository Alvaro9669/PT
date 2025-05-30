const express = require('express');
const { createProducto } = require('../controllers/productoController');

const router = express.Router();

router.post('/', createProducto);

module.exports = router;