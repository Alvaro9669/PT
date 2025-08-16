const express = require('express');
const router = express.Router();
const Carrito = require('../models/carritos');
const pool = require('../config/database');

// Obtener el carrito y los productos asociados para el usuario autenticado
router.get('/', async (req, res) => {
    console.log('Entrando a comprobar carrito');
    try {
        // Verifica si el usuario está autenticado mediante cookie
        const userCookie = req.cookies.user;
        if (!userCookie) {
            return res.status(401).send('Not authenticated');
        }

        const user = JSON.parse(userCookie); // Obtiene el usuario desde la cookie
        const discordId = user.id; // ID de Discord desde la cookie
        console.log('Discord ID from cookie:', discordId);

        // Busca el ID_usuarios correspondiente al discord_id
        const [rows] = await pool.query('SELECT ID_usuarios FROM usuarios WHERE discord_id = ?', [discordId]);
        if (rows.length === 0) {
            console.log('No user found for Discord ID:', discordId);
            return res.status(404).send('User not found');
        }

        const userId = rows[0].ID_usuarios; // ID_usuarios correspondiente al discord_id
        console.log('User ID from database:', userId);

        // Busca el carrito asociado al usuario y los productos en el carrito
        const [carritoProductos] = await pool.query(
            `SELECT 
                c.ID_carritos,
                ac.cantidad,
                p.ID_producto,
                p.n_articulo,
                p.imagen,
                p.precio
            FROM carritos c
            INNER JOIN articulos_carrito ac ON c.ID_carritos = ac.carrito_FK
            INNER JOIN producto p ON ac.producto_FK = p.ID_producto
            WHERE c.usuario_FK = ?`,
            [userId]
        );

        if (carritoProductos.length === 0) {
            console.log('No carrito or products found for user:', userId);
            return res.json([]);
        }

        // Convierte las imágenes a base64
        const carritoConImagenes = carritoProductos.map(item => ({
            ...item,
            imagen: item.imagen ? `data:image/jpeg;base64,${item.imagen.toString('base64')}` : null,
        }));

        console.log('Carrito and products found:', carritoConImagenes);
        res.json(carritoConImagenes);
    } catch (error) {
        console.error('Error fetching carrito and products:', error.message);
        res.status(500).json({ error: error.message });
    }
});
// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const carrito = await Carrito.create(req.body);
        res.status(201).json(carrito);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/productos/:id', async (req, res) => {
    try {
        const { cantidad } = req.body; // Nueva cantidad
        const productoId = parseInt(req.params.id, 10);

        if (isNaN(productoId) || cantidad < 0) {
            return res.status(400).send('Invalid product ID or quantity');
        }

        // Verifica si el usuario está autenticado
        const userCookie = req.cookies.user;
        if (!userCookie) {
            return res.status(401).send('Not authenticated');
        }

        const user = JSON.parse(userCookie);
        const discordId = user.id;

        // Busca el ID_usuarios correspondiente al discord_id
        const [rows] = await pool.query('SELECT ID_usuarios FROM usuarios WHERE discord_id = ?', [discordId]);
        if (rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const userId = rows[0].ID_usuarios;

        // Verifica si el producto pertenece al carrito del usuario
        const [carritoProducto] = await pool.query(
            `SELECT ac.ID_articulosc, ac.cantidad, c.usuario_FK
             FROM articulos_carrito ac
             INNER JOIN carritos c ON ac.carrito_FK = c.ID_carritos
             WHERE ac.producto_FK = ? AND c.usuario_FK = ?`,
            [productoId, userId]
        );

        if (carritoProducto.length === 0) {
            return res.json([]);
        }

        const articuloId = carritoProducto[0].ID_articulosc;

        if (cantidad === 0) {
            // Elimina el producto del carrito si la cantidad es 0
            await pool.query('DELETE FROM articulos_carrito WHERE ID_articulosc = ?', [articuloId]);
            return res.status(200).send('Product removed from carrito');
        } else {
            // Actualiza la cantidad del producto
            await pool.query('UPDATE articulos_carrito SET cantidad = ? WHERE ID_articulosc = ?', [cantidad, articuloId]);
            return res.status(200).send('Product quantity updated');
        }
    } catch (error) {
        console.error('Error updating product quantity:', error.message);
        res.status(500).json({ error: error.message });
    }
});
// Obtener un carrito por ID
router.get('/:id', async (req, res) => {
    console.log('Entrando a comprobar carrito');
    try {
        // Verifica si el usuario está autenticado
        const userCookie = req.cookies.user;
        if (!userCookie) {
            return res.status(401).send('Not authenticated');
        }

        const user = JSON.parse(userCookie); // Obtiene el usuario desde la cookie
        const discordId = user.id; // ID de Discord desde la cookie
        console.log('Discord ID from cookie:', discordId);

        // Busca el ID_usuarios correspondiente al discord_id
        const [rows] = await pool.query('SELECT ID_usuarios FROM usuarios WHERE discord_id = ?', [discordId]);
        if (rows.length === 0) {
            console.log('No user found for Discord ID:', discordId);
            return res.status(404).send('User not found');
        }

        const userId = rows[0].ID_usuarios; // ID_usuarios correspondiente al discord_id
        console.log('User ID from database:', userId);

        // Busca el carrito asociado al usuario
        const [carritoRows] = await pool.query(
            'SELECT * FROM carritos WHERE usuario_FK = ?',
            [userId]
        );

        if (carritoRows.length === 0) {
            console.log('No carrito found for user:', userId);
            return res.status(404).send('Carrito not found');
        }

        const carrito = carritoRows[0];
        console.log('Carrito found:', carrito);
        res.json(carrito);
    } catch (error) {
        console.error('Error fetching carrito:', error.message);
        res.status(500).json({ error: error.message });
    }
});


// Agregar un producto al carrito
router.post('/productos', async (req, res) => {
    try {
        const { productoId, cantidad } = req.body;

        if (!productoId || cantidad <= 0) {
            return res.status(400).send('Invalid product ID or quantity');
        }

        // Verifica si el usuario está autenticado
        const userCookie = req.cookies.user;
        if (!userCookie) {
            return res.status(401).send('Not authenticated');
        }

        const user = JSON.parse(userCookie);
        const discordId = user.id;

        // Busca el ID_usuarios correspondiente al discord_id
        const [rows] = await pool.query('SELECT ID_usuarios FROM usuarios WHERE discord_id = ?', [discordId]);
        if (rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const userId = rows[0].ID_usuarios;

        // Verifica si el usuario ya tiene un carrito
        const [carritoRows] = await pool.query('SELECT ID_carritos FROM carritos WHERE usuario_FK = ?', [userId]);
        let carritoId;

        if (carritoRows.length === 0) {
            // Crea un nuevo carrito si no existe
            const [result] = await pool.query('INSERT INTO carritos (usuario_FK) VALUES (?)', [userId]);
            carritoId = result.insertId;
            console.log('New carrito created with ID:', carritoId);
        } else {
            carritoId = carritoRows[0].ID_carritos;
            console.log('Existing carrito found with ID:', carritoId);
        }

        // Verifica si el producto ya está en el carrito
        const [productoEnCarrito] = await pool.query(
            'SELECT cantidad FROM articulos_carrito WHERE carrito_FK = ? AND producto_FK = ?',
            [carritoId, productoId]
        );

        if (productoEnCarrito.length > 0) {
            // Si el producto ya está en el carrito, suma la cantidad
            const nuevaCantidad = productoEnCarrito[0].cantidad + cantidad;
            await pool.query(
                'UPDATE articulos_carrito SET cantidad = ? WHERE carrito_FK = ? AND producto_FK = ?',
                [nuevaCantidad, carritoId, productoId]
            );
            console.log('Product quantity updated in carrito');
        } else {
            // Si el producto no está en el carrito, agrégalo
            await pool.query(
                'INSERT INTO articulos_carrito (carrito_FK, producto_FK, cantidad) VALUES (?, ?, ?)',
                [carritoId, productoId, cantidad]
            );
            console.log('Product added to carrito');
        }

        res.status(200).send('Product added to carrito successfully');
    } catch (error) {
        console.error('Error adding product to carrito:', error.message);
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;