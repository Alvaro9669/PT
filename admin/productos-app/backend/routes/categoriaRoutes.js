const express = require('express');
const { getCategorias, getSubcategoriasByCategoria } = require('../controllers/categoriaController');

const router = express.Router();

router.get('/', getCategorias);
router.get('/:categoriaId/subcategorias', getSubcategoriasByCategoria);

module.exports = router;