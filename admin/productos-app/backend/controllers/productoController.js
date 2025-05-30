const pool = require('../config/database');

const createProducto = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.files?.imagen);

    const { n_articulo, precio, categoria_FK, scategoria_FK } = req.body;
    const imagen = req.files?.imagen ? req.files.imagen.data : null;

    if (!n_articulo || !precio || !categoria_FK || !imagen) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const [result] = await pool.query(
      'INSERT INTO producto (n_articulo, imagen, precio, categoria_FK, scategoria_FK) VALUES (?, ?, ?, ?, ?)',
      [n_articulo, imagen, precio, categoria_FK, scategoria_FK]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  createProducto,
};