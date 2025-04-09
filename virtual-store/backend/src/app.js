require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const paypalRoutes = require('./routes/paypalRoutes'); // Ajusta la ruta según tu estructura

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL, // URL del cliente (React)
    credentials: true, // Permitir el envío de cookies
}));

// Rutas
app.use('/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/carritos', carritoRoutes);
app.use('/api/paypal', paypalRoutes); // Monta las rutas de PayPal

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});