const pool = require('../config/database');

const Usuario = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        return rows;
    },

    async create(data) {
        const { discord_id, correo, imagen, n_usuario } = data;
        const [result] = await pool.query(
            'INSERT INTO usuarios (discord_id, correo, imagen, n_usuario) VALUES (?, ?, ?, ?)',
            [discord_id, correo, imagen, n_usuario]
        );
        return result;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE ID_usuarios = ?', [id]);
        return rows[0];
    },
};

module.exports = Usuario;