require('dotenv').config(); // Carga variables de entorno desde .env
const express = require('express');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // Permite recibir JSON en las peticiones
app.use(cookieParser()); // Permite leer cookies en las peticiones
app.use(cors({
    origin: process.env.FRONTEND_URL, // Permite solicitudes desde el frontend
    credentials: true, // Permite el envío de cookies
}));

// Load routes with error handling
console.log('Loading routes...');

try {
    const authRoutes = require('./routes/authRoutes');
    app.use('/auth', authRoutes);
    console.log('✓ Auth routes loaded');
} catch (error) {
    console.error('✗ Error loading auth routes:', error.message);
}

try {
    const usuarioRoutes = require('./routes/usuarioRoutes');
    app.use('/api/usuarios', usuarioRoutes);
    console.log('✓ Usuario routes loaded');
} catch (error) {
    console.error('✗ Error loading usuario routes:', error.message);
}

try {
    const productoRoutes = require('./routes/productoRoutes');
    app.use('/api/productos', productoRoutes);
    console.log('✓ Producto routes loaded');
} catch (error) {
    console.error('✗ Error loading producto routes:', error.message);
}

try {
    const ticketRoutes = require('./routes/ticketRoutes');
    app.use('/api/tickets', ticketRoutes);
    console.log('✓ Ticket routes loaded');
} catch (error) {
    console.error('✗ Error loading ticket routes:', error.message);
}

try {
    const carritoRoutes = require('./routes/carritoRoutes');
    app.use('/api/carritos', carritoRoutes);
    console.log('✓ Carrito routes loaded');
} catch (error) {
    console.error('✗ Error loading carrito routes:', error.message);
}

try {
    const paypalRoutes = require('./routes/paypalRoutes');
    app.use('/api/paypal', paypalRoutes);
    console.log('✓ PayPal routes loaded');
} catch (error) {
    console.error('✗ Error loading paypal routes:', error.message);
}

try {
    const categoriaRoutes = require('./routes/categoriaRoutes');
    app.use('/api/categorias', categoriaRoutes);
    console.log('✓ Categoria routes loaded');
} catch (error) {
    console.error('✗ Error loading categoria routes:', error.message);
    console.error('Full error:', error);
}

// Test database connection
const testDatabaseConnection = async () => {
    try {
        const pool = require('./config/database');
        const [result] = await pool.query('SELECT 1 as test');
        console.log('✓ Database connection successful');
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
    }
};

testDatabaseConnection();

// Add debugging middleware to log all requests - MOVED AFTER ROUTES
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Add a catch-all route for debugging 404s - MOVED TO THE END
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Route not found' });
});

// Iniciar el servidor en la IP y puerto especificados
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://192.168.1.116:${PORT}`);
});