const pool = require('../config/database');

const Carrito = {
    // Obtiene todos los carritos
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM carritos');
        return rows;
    },

    // Crea un nuevo carrito
    async create(data) {
        const { usuario_FK } = data;
        const [result] = await pool.query(
            'INSERT INTO carritos (usuario_FK) VALUES (?)',
            [usuario_FK]
        );
        return result;
    },

    // Obtiene un carrito por su ID
    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM carritos WHERE ID_carritos = ?', [id]);
        return rows[0];
    },
};

module.exports = Carrito;