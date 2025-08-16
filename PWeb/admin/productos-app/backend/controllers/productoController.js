const pool = require('../config/database');

// Controlador para crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    // Mostrar datos recibidos para depuración
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.files?.imagen);

    // Extraer datos del cuerpo de la petición
    const { n_articulo, precio, categoria_FK, scategoria_FK } = req.body;
    // Obtener imagen si fue enviada
    const imagen = req.files?.imagen ? req.files.imagen.data : null;

    // Validar que todos los campos requeridos estén presentes
    if (!n_articulo || !precio || !categoria_FK || !imagen) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Insertar el producto en la base de datos
    const [result] = await pool.query(
      'INSERT INTO producto (n_articulo, imagen, precio, categoria_FK, scategoria_FK) VALUES (?, ?, ?, ?, ?)',
      [n_articulo, imagen, precio, categoria_FK, scategoria_FK]
    );

    // Responder con el ID del nuevo producto
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    // Manejo de errores
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  createProducto,
};