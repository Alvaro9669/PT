const pool = require('../config/database');

const Ticket = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM ticket');
        return rows;
    },

    async create(data) {
        const { usuario_FK, fecha, hora, total, notificar } = data;
        const [result] = await pool.query(
            'INSERT INTO ticket (usuario_FK, fecha, hora, total, notificar) VALUES (?, ?, ?, ?, ?)',
            [usuario_FK, fecha, hora, total, notificar]
        );
        return result;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM ticket WHERE ID_ticket = ?', [id]);
        return rows[0];
    },
};

module.exports = Ticket;