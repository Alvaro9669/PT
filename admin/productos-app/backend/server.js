const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const productoRoutes = require('./routes/productoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Rutas
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));