import React, { useState, useEffect } from 'react';
import './carrito.css';
import axios from 'axios';
import PaypalButton from '../components/PaypalButton';
import { useNavigate } from 'react-router-dom';

const Carrito = () => {
    // Estados para gestionar el carrito de compras
    const [carrito, setCarrito] = useState([]); // Lista de productos en el carrito
    const [total, setTotal] = useState(0);      // Total del carrito en pesos mexicanos
    const [error, setError] = useState(null);   // Manejo de errores
    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener los productos del carrito desde el backend
        const fetchCarrito = async () => {
            try {
                // Solicitar datos del carrito del usuario autenticado
                const carritoResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/carritos/`, { withCredentials: true });
                console.log('Carrito data from backend:', carritoResponse.data);
    
                setCarrito(carritoResponse.data);
    
                // Calcular el total del carrito (precio × cantidad por cada producto)
                const totalCarrito = carritoResponse.data.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
                setTotal(totalCarrito);
            } catch (error) {
                console.error('Error fetching carrito:', error);
                setError('No se pudo cargar el carrito. Por favor, intenta nuevamente.');
            }
        };
    
        fetchCarrito();
    }, []);

    // Función para cambiar la cantidad de un producto en el carrito
    const handleCantidadChange = async (id, nuevaCantidad) => {
        try {
            if (nuevaCantidad < 0) return; // Evitar cantidades negativas

            // Actualizar cantidad en el backend
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/carritos/productos/${id}`, { cantidad: nuevaCantidad }, { withCredentials: true });

            // Actualizar el estado local del carrito (filtrar productos con cantidad 0)
            const updatedCarrito = carrito.map(item =>
                item.ID_producto === id ? { ...item, cantidad: nuevaCantidad } : item
            ).filter(item => item.cantidad > 0);
            setCarrito(updatedCarrito);

            // Recalcular el total del carrito
            const totalCarrito = updatedCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
            setTotal(totalCarrito);
        } catch (error) {
            console.error('Error updating cantidad:', error);
        }
    };

    // Función para eliminar completamente un producto del carrito
    const handleEliminarProducto = async (id) => {
        try {
            // Establecer cantidad en 0 para eliminar el producto
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/carritos/productos/${id}`, { cantidad: 0 }, { withCredentials: true });

            // Actualizar el estado local removiendo el producto
            const updatedCarrito = carrito.filter(item => item.ID_producto !== id);
            setCarrito(updatedCarrito);

            // Recalcular el total sin el producto eliminado
            const totalCarrito = updatedCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
            setTotal(totalCarrito);
        } catch (error) {
            console.error('Error deleting producto:', error);
        }
    };

    // Mostrar mensaje de error si hay problemas cargando el carrito
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    
    return (
        <div className="carrito-container">
            <h1 className="carrito-title">Mi Carrito</h1>
            <div className="carrito-items">
                {carrito.length === 0 ? (
                    // Mostrar mensaje si el carrito está vacío con opción de ir al inicio
                    <div
                        className="carrito-vacio"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                        title="Ir al inicio"
                    >
                        <p>Tu carrito está vacío.</p>
                    </div>
                ) : (
                    // Mostrar productos en el carrito
                    carrito.map(item => (
                        <div key={item.ID_producto} className="carrito-item">
                            {/* Imagen del producto con fallback */}
                            <img src={item.imagen || '/images/default-product.png'} alt={item.n_articulo} className="carrito-imagen" />
                            <div className="carrito-info">
                                <h2>{item.n_articulo}</h2>
                                <p>Precio: ${item.precio.toFixed(2)} MXN</p>
                                
                                {/* Control de cantidad con botones + y - */}
                                <div className="carrito-cantidad">
                                    <label>Cantidad:</label>
                                    <div className="cantidad-control">
                                        <button
                                            className="cantidad-boton"
                                            onClick={() => handleCantidadChange(item.ID_producto, Math.max(0, item.cantidad - 1))}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.cantidad}
                                            onChange={(e) => handleCantidadChange(item.ID_producto, parseInt(e.target.value))}
                                        />
                                        <button
                                            className="cantidad-boton"
                                            onClick={() => handleCantidadChange(item.ID_producto, item.cantidad + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {/* Botón para eliminar producto completamente */}
                                <button className="carrito-eliminar" onClick={() => handleEliminarProducto(item.ID_producto)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Sección de pago y total */}
            <div className="carrito-total-container">
                <div id="paypal-button-container">
                    {/* Componente de botón de pago con PayPal */}
                    <PaypalButton total={total} />
                </div>
                <div className="carrito-total">
                    <h2>Total: ${total.toFixed(2)} MXN</h2>
                </div>
            </div>
        </div>
    );
};

export default Carrito;