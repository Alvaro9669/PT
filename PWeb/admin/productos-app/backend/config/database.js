const mysql = require('mysql2');
require('dotenv').config();

// Crear un pool de conexiones a la base de datos usando variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST,     // Host de la base de datos
    user: process.env.DB_USER,     // Usuario
    password: process.env.DB_PASSWORD, // Contraseña
    database: process.env.DB_NAME, // Nombre de la base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool.promise(); // Exporta el pool con soporte para promesas