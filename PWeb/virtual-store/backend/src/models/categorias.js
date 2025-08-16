const pool = require('../config/database');

const Categoria = {
    // Obtiene todas las categorías
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM categoria ORDER BY n_categoria');
        return rows;
    },

    // Obtiene subcategorías por ID de categoría
    async getSubcategorias(categoriaId) {
        const [rows] = await pool.query(
            'SELECT * FROM sub_categoria WHERE categoria_FK = ? ORDER BY n_scategoria',
            [categoriaId]
        );
        return rows;
    },
};

module.exports = Categoria;
