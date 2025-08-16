const pool = require('../config/database');

const Usuario = {
    // Obtiene todos los usuarios de la base de datos
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        return rows;
    },

    // Crea un nuevo usuario
    async create(data) {
        const { discord_id, correo, imagen, n_usuario } = data;
        const [result] = await pool.query(
            'INSERT INTO usuarios (discord_id, correo, imagen, n_usuario) VALUES (?, ?, ?, ?)',
            [discord_id, correo, imagen, n_usuario]
        );
        return result;
    },

    // Obtiene un usuario por su ID
    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE ID_usuarios = ?', [id]);
        return rows[0];
    },
};

module.exports = Usuario;