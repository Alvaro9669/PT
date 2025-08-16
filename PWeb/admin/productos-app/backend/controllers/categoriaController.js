const pool = require('../config/database');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categoria');
        res.json(rows); // Responde con la lista de categorías
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
};

// Obtener subcategorías de una categoría específica
const getSubcategoriasByCategoria = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM sub_categoria WHERE categoria_FK = ?',
            [req.params.categoriaId]
        );
        res.json(rows); // Responde con la lista de subcategorías
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
};

module.exports = {
    getCategorias,
    getSubcategoriasByCategoria,
};