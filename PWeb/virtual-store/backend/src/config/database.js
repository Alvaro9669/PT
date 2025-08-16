const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('Database config:');
console.log('- Host:', process.env.DB_HOST);
console.log('- User:', process.env.DB_USER);
console.log('- Database:', process.env.DB_NAME);
console.log('- Port:', process.env.DB_PORT);

// Crea un pool de conexiones a la base de datos usando variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST,     // Host de la base de datos
    user: process.env.DB_USER,     // Usuario
    password: process.env.DB_PASSWORD, // Contraseña
    database: process.env.DB_NAME, // Nombre de la base de datos
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;