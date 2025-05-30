const pool = require('../config/database');

const Producto = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM producto');
        // Convierte la imagen binaria a base64
        return rows.map(row => ({
            ...row,
            imagen: row.imagen ? `data:image/jpeg;base64,${row.imagen.toString('base64')}` : null,
        }));
    },

    async create(data) {
        const { n_articulo, imagen, precio, categoria_FK, scategoria_FK } = data;
        const [result] = await pool.query(
            'INSERT INTO producto (n_articulo, imagen, precio, categoria_FK, scategoria_FK) VALUES (?, ?, ?, ?, ?)',
            [n_articulo, imagen, precio, categoria_FK, scategoria_FK]
        );
        return result;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM producto WHERE ID_producto = ?', [id]);
        return rows[0];
    },
};

module.exports = Producto;