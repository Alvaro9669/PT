import React, { useEffect, useState } from 'react';
import './productos.css';
import axios from 'axios';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [cantidad, setCantidad] = useState({}); // Estado para manejar la cantidad de cada producto
    const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: '' }); // Estado para manejar la notificación

    useEffect(() => {
        // Obtener los productos desde el backend
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/productos`)
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleAgregarAlCarrito = async (productoId) => {
        try {
            const cantidadSeleccionada = cantidad[productoId] || 1; // Si no se seleccionó cantidad, usar 1 por defecto
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/carritos/productos`, {
                productoId,
                cantidad: cantidadSeleccionada
            }, { withCredentials: true });

            // Mostrar la notificación verde
            setNotificacion({ visible: true, mensaje: 'Producto agregado exitosamente', tipo: 'success' });
            setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: '' }), 1000); // Ocultar la notificación después de 1 segundo
        } catch (error) {
            console.error('Error adding product to carrito:', error);

            // Mostrar la notificación roja si el usuario no está autenticado
            if (error.response && error.response.status === 401) {
                setNotificacion({ visible: true, mensaje: 'Inicie sesión para poder agregar al carrito', tipo: 'error' });
                setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: '' }), 1500); // Ocultar la notificación después de 2 segundos
            } else {
                alert('Error al agregar el producto al carrito');
            }
        }
    };

    const handleCantidadChange = (productoId, nuevaCantidad) => {
        setCantidad(prev => ({ ...prev, [productoId]: nuevaCantidad }));
    };


    return (
        <div className="productos-container">
            <h1 className="productos-title">Tienda Virtual</h1>
    
            {/* Notificación */}
            {notificacion.visible && (
                <div className={`notificacion ${notificacion.tipo}`}>
                    {notificacion.mensaje}
                </div>
            )}
    
            <div className="productos-grid">
                {productos.map(producto => (
                    <div key={producto.ID_producto} className="producto-card">
                        <img 
                            src={producto.imagen || '/images/shop_cart.svg'} 
                            alt={producto.n_articulo} 
                            className="producto-imagen" 
                        />
                        <h2 className="producto-nombre">{producto.n_articulo}</h2>
                        <p className="producto-precio">${producto.precio.toFixed(2)} MXN</p>
                        <div className="producto-cantidad">
                            <label>Cantidad:</label>
                            <div className="cantidad-control">
                                <button
                                    className="cantidad-boton"
                                    onClick={() => handleCantidadChange(producto.ID_producto, Math.max(1, (cantidad[producto.ID_producto] || 1) - 1))}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={cantidad[producto.ID_producto] || 1}
                                    onChange={(e) => handleCantidadChange(producto.ID_producto, parseInt(e.target.value))}
                                />
                                <button
                                    className="cantidad-boton"
                                    onClick={() => handleCantidadChange(producto.ID_producto, (cantidad[producto.ID_producto] || 1) + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button 
                            className="producto-boton" 
                            onClick={() => handleAgregarAlCarrito(producto.ID_producto)}
                        >
                            Agregar al Carrito
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Productos;