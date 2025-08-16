const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Función utilitaria para formatear nombres de categorías
const formatCategoryName = (name) => {
    if (!name) return name;
    
    return name
        .replace(/_/g, ' ')  // Reemplazar guiones bajos con espacios
        .split(' ')          // Dividir en palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizar
        .join(' ');          // Unir palabras
};

// Ruta de prueba para verificar que el router funciona
router.get('/test', (req, res) => {
    console.log('Categorias test route works!');
    res.json({ message: 'Categorias router is working', timestamp: new Date() });
});

// Ruta para obtener todas las categorías disponibles
router.get('/', async (req, res) => {
    console.log('GET /api/categorias called');
    try {
        // Consultar todas las categorías ordenadas alfabéticamente
        const [rows] = await pool.query('SELECT * FROM categoria ORDER BY n_categoria');
        
        // Formatear los nombres de categorías para mejor presentación
        const formattedCategories = rows.map(category => ({
            ...category,
            displayName: formatCategoryName(category.n_categoria), // Nombre formateado para mostrar
            originalName: category.n_categoria // Nombre original para uso interno
        }));
        
        console.log(`Categories found: ${rows.length}`);
        res.json(formattedCategories);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Error fetching categories', 
            message: error.message 
        });
    }
});

// Ruta para obtener subcategorías de una categoría específica
router.get('/:categoriaId/subcategorias', async (req, res) => {
    console.log(`GET subcategorias for category: ${req.params.categoriaId}`);
    try {
        // Consultar subcategorías que pertenecen a la categoría especificada
        const [rows] = await pool.query(
            'SELECT * FROM sub_categoria WHERE categoria_FK = ? ORDER BY n_scategoria',
            [req.params.categoriaId]
        );
        
        // Formatear nombres de subcategorías para presentación
        const formattedSubcategories = rows.map(subcategory => ({
            ...subcategory,
            displayName: formatCategoryName(subcategory.n_scategoria),
            originalName: subcategory.n_scategoria
        }));
        
        console.log(`Subcategories found: ${rows.length}`);
        res.json(formattedSubcategories);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Error fetching subcategories', 
            message: error.message 
        });
    }
});

module.exports = router;

