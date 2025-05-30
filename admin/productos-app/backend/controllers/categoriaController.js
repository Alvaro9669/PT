const pool = require('../config/database');

const getCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categoria');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSubcategoriasByCategoria = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM sub_categoria WHERE categoria_FK = ?',
            [req.params.categoriaId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCategorias,
    getSubcategoriasByCategoria,
};