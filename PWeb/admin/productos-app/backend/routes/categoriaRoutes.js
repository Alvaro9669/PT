const express = require('express');
const { getCategorias, getSubcategoriasByCategoria } = require('../controllers/categoriaController');

const router = express.Router();

// Ruta para obtener todas las categorías
router.get('/', getCategorias);

// Ruta para obtener subcategorías de una categoría específica
router.get('/:categoriaId/subcategorias', getSubcategoriasByCategoria);

module.exports = router;