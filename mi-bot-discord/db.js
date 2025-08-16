// Módulo para gestionar la conexión y consultas a la base de datos MySQL
const mysql = require('mysql2/promise'); // Cliente MySQL con soporte para async/await
require('dotenv').config(); // Cargar variables de entorno

// Crear pool de conexiones para optimizar el rendimiento
// El pool reutiliza conexiones existentes en lugar de crear nuevas cada vez
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // Servidor de base de datos
  user: process.env.DB_USER,         // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña de la base de datos
  database: process.env.DB_NAME,     // Nombre de la base de datos
  waitForConnections: true,          // Esperar conexiones disponibles si se agota el pool
  connectionLimit: 10,               // Máximo 10 conexiones simultáneas
  supportBigNumbers: true,           // Soporte para números grandes (BIGINT)
  bigNumberStrings: true             // Convertir números grandes a strings para evitar pérdida de precisión
});

module.exports = {
  // Obtener información completa de un ticket específico
  getTicket: async (ticketId) => {
    console.log(`[DEBUG] Buscando ticket ID: ${ticketId} (Tipo: ${typeof ticketId})`); 
    // JOIN para combinar información del ticket con datos del usuario
    const [rows] = await pool.query(`
      SELECT T.*, U.n_usuario, CAST(U.discord_id AS CHAR) AS discord_id 
      FROM ticket T
      JOIN usuarios U ON T.usuario_FK = U.ID_usuarios
      WHERE T.ID_ticket = ?`, [ticketId]);
    return rows[0]; // Retornar primer resultado (debería ser único)
  },

  // Obtener todos los artículos asociados a un ticket
  getArticulosTicket: async (ticketId) => {
    // JOIN para combinar artículos del ticket con información del producto
    const [rows] = await pool.query(`
      SELECT AT.cantidad, AT.precio_compra, P.n_articulo 
      FROM articulos_ticket AT
      JOIN producto P ON AT.producto_FK = P.ID_producto
      WHERE AT.ticket_FK = ?`, [ticketId]);
    return rows; // Retornar array de artículos
  },

  // Buscar todos los tickets que necesitan notificación
  checkNotificar: async () => {
    // Buscar tickets con flag notificar = 1 y obtener información del usuario
    const [rows] = await pool.query(`
      SELECT T.ID_ticket, T.usuario_FK, CAST(U.discord_id AS CHAR) AS discord_id
      FROM ticket T
      JOIN usuarios U ON T.usuario_FK = U.ID_usuarios
      WHERE T.notificar = 1`);
    return rows; // Retornar array de tickets pendientes
  },

  // Marcar un ticket como ya notificado (cambiar flag a 0)
  resetNotificar: async (ticketId) => {
    await pool.query('UPDATE ticket SET notificar = 0 WHERE ID_ticket = ?', [ticketId]);
  }
};