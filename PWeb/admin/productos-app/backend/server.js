const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const productoRoutes = require('./routes/productoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');

const app = express();

// Middlewares
app.use(cors()); // Permite solicitudes de diferentes orígenes (CORS)
app.use(express.json()); // Permite recibir JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Permite recibir datos codificados en URL
app.use(fileUpload()); // Permite la subida de archivos

// Rutas
app.use('/api/categorias', categoriaRoutes); // Rutas para categorías
app.use('/api/productos', productoRoutes);   // Rutas para productos

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`)); // Inicia el servidor