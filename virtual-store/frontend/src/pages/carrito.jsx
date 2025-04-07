import React, { useState, useEffect } from 'react';
import './carrito.css';
import axios from 'axios';
import PaypalButton from '../components/PaypalButton'; // Importar el botón de PayPal

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Validar la cookie del usuario y obtener el carrito
        const fetchCarrito = async () => {
            try {
                const carritoResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/carritos/`, { withCredentials: true });
                console.log('Carrito data from backend:', carritoResponse.data);

                setCarrito(carritoResponse.data);

                // Calcular el total
                const totalCarrito = carritoResponse.data.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
                setTotal(totalCarrito);
            } catch (error) {
                console.error('Error fetching carrito:', error);
                setError('No se pudo cargar el carrito. Por favor, intenta nuevamente.');
            }
        };

        fetchCarrito();
    }, []);

    const handleCantidadChange = async (id, nuevaCantidad) => {
        try {
            if (nuevaCantidad < 0) return; // Evitar cantidades negativas

            // Actualizar en el backend
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/carritos/productos/${id}`, { cantidad: nuevaCantidad }, { withCredentials: true });

            // Actualizar el estado local
            const updatedCarrito = carrito.map(item =>
                item.ID_producto === id ? { ...item, cantidad: nuevaCantidad } : item
            ).filter(item => item.cantidad > 0); // Eliminar productos con cantidad 0
            setCarrito(updatedCarrito);

            // Actualizar el total
            const totalCarrito = updatedCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
            setTotal(totalCarrito);
        } catch (error) {
            console.error('Error updating cantidad:', error);
        }
    };

    const handleEliminarProducto = async (id) => {
        try {
            // Actualizar en el backend
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/carritos/productos/${id}`, { cantidad: 0 }, { withCredentials: true });

            // Actualizar el estado local
            const updatedCarrito = carrito.filter(item => item.ID_producto !== id);
            setCarrito(updatedCarrito);

            // Actualizar el total
            const totalCarrito = updatedCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
            setTotal(totalCarrito);
        } catch (error) {
            console.error('Error deleting producto:', error);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="carrito-container">
            <h1 className="carrito-title">Mi Carrito</h1>
            <div className="carrito-items">
                {carrito.map(item => (
                    <div key={item.ID_producto} className="carrito-item">
                        <img src={item.imagen || '/images/default-product.png'} alt={item.n_articulo} className="carrito-imagen" />
                        <div className="carrito-info">
                            <h2>{item.n_articulo}</h2>
                            <p>Precio: ${item.precio.toFixed(2)}</p>
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
                            <button className="carrito-eliminar" onClick={() => handleEliminarProducto(item.ID_producto)}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="carrito-total-container">
            <div id="paypal-button-container">
                <PaypalButton total={total} />
            </div>
            <div className="carrito-total">
                <h2>Total: ${total.toFixed(2)}</h2>
            </div>
        </div>
        </div>
    );
};

export default Carrito;