const pool = require('../config/database'); // Conexión a la base de datos

const Ticket = {
    async create(userId, total) {
        // Crear el ticket
        const [ticketResult] = await pool.query(
            'INSERT INTO ticket (usuario_FK, fecha, hora, total, notificar) VALUES (?, CURDATE(), CURTIME(), ?, 1)',
            [userId, total]
        );
        const ticketId = ticketResult.insertId;

        console.log('Ticket creado con ID:', ticketId);

        // Copiar los artículos del carrito a la tabla articulos_ticket
        const [carritoArticulos] = await pool.query(
            `SELECT ac.producto_FK, ac.cantidad, p.precio
             FROM articulos_carrito ac
             INNER JOIN producto p ON ac.producto_FK = p.ID_producto
             INNER JOIN carritos c ON ac.carrito_FK = c.ID_carritos
             WHERE c.usuario_FK = ?`,
            [userId]
        );

        for (const articulo of carritoArticulos) {
            await pool.query(
                'INSERT INTO articulos_ticket (ticket_FK, producto_FK, cantidad, precio_compra) VALUES (?, ?, ?, ?)',
                [ticketId, articulo.producto_FK, articulo.cantidad, articulo.precio]
            );
        }

        console.log('Artículos del carrito copiados al ticket.');

        // Vaciar el carrito
        await pool.query(
            `DELETE ac
             FROM articulos_carrito ac
             INNER JOIN carritos c ON ac.carrito_FK = c.ID_carritos
             WHERE c.usuario_FK = ?`,
            [userId]
        );

        console.log('Carrito vaciado.');

        return ticketId;
    },

    async getAll() {
        const [rows] = await pool.query('SELECT * FROM ticket');
        return rows;
    },

    async getById(ticketId) {
        const [rows] = await pool.query('SELECT * FROM ticket WHERE ID_ticket = ?', [ticketId]);
        return rows[0];
    }
};

module.exports = Ticket;