import React, { useEffect, useState } from 'react';
import './productos.css';
import axios from 'axios';

const Productos = () => {
    // Estados para gestionar productos y filtros
    const [productos, setProductos] = useState([]); // Lista completa de productos
    const [productosFiltrados, setProductosFiltrados] = useState([]); // Productos después de aplicar filtros
    const [cantidad, setCantidad] = useState({}); // Cantidad seleccionada para cada producto
    const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: '' }); // Sistema de notificaciones
    
    // Estados para el sistema de filtros
    const [filtros, setFiltros] = useState({
        nombre: '',      // Filtro por nombre de producto
        categoria: '',   // Filtro por categoría
        subcategoria: '' // Filtro por subcategoría
    });
    const [categorias, setCategorias] = useState([]);     // Lista de categorías disponibles
    const [subcategorias, setSubcategorias] = useState([]); // Lista de subcategorías de la categoría seleccionada

    useEffect(() => {
        // Configurar URL del backend con fallback
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://192.168.1.116:5000';
        console.log('Backend URL:', backendUrl);
        
        // Función para cargar datos iniciales (productos y categorías)
        const fetchData = async () => {
            try {
                console.log('Fetching productos from:', `${backendUrl}/api/productos`);
                // Obtener lista de productos desde el backend
                const productosRes = await fetch(`${backendUrl}/api/productos`);
                if (!productosRes.ok) {
                    throw new Error(`Productos API error! status: ${productosRes.status} - ${productosRes.statusText}`);
                }
                const productosData = await productosRes.json();
                console.log('Productos fetched successfully:', productosData.length);
                setProductos(productosData);
                setProductosFiltrados(productosData); // Inicialmente mostrar todos los productos

                console.log('Fetching categorias from:', `${backendUrl}/api/categorias`);
                // Obtener lista de categorías para el filtro
                const categoriasRes = await fetch(`${backendUrl}/api/categorias`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include' // Incluir cookies de autenticación
                });
                
                if (!categoriasRes.ok) {
                    throw new Error(`Categorias API error! status: ${categoriasRes.status} - ${categoriasRes.statusText}`);
                }
                
                const categoriasData = await categoriasRes.json();
                console.log('Categorias fetched successfully:', categoriasData);
                setCategorias(categoriasData);
            } catch (error) {
                console.error('Error completo:', error);
                console.error('Error stack:', error.stack);
                // Mostrar error al usuario con información detallada
                setNotificacion({ 
                    visible: true, 
                    mensaje: `Error al cargar datos: ${error.message}. Verifica que el servidor esté corriendo en ${backendUrl}`, 
                    tipo: 'error' 
                });
            }
        };

        fetchData();
    }, []);

    // Efecto para cargar subcategorías cuando cambia la categoría seleccionada
    useEffect(() => {
        const fetchSubcategorias = async () => {
            if (!filtros.categoria) {
                setSubcategorias([]); // Limpiar subcategorías si no hay categoría seleccionada
                return;
            }
            try {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://192.168.1.116:5000';
                const url = `${backendUrl}/api/categorias/${filtros.categoria}/subcategorias`;
                console.log('Fetching subcategorias from:', url);
                
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                
                if (!res.ok) {
                    throw new Error(`Subcategorias API error! status: ${res.status} - ${res.statusText}`);
                }
                
                const data = await res.json();
                console.log('Subcategorias fetched successfully:', data);
                setSubcategorias(data);
            } catch (error) {
                console.error('Error fetching subcategorias:', error);
                setSubcategorias([]);
                setNotificacion({ 
                    visible: true, 
                    mensaje: `Error al cargar subcategorías: ${error.message}`, 
                    tipo: 'error' 
                });
            }
        };
        fetchSubcategorias();
    }, [filtros.categoria]);

    // Efecto para aplicar filtros a la lista de productos
    useEffect(() => {
        let productosFiltrados = productos;

        // Filtrar por nombre de producto (búsqueda de texto)
        if (filtros.nombre.trim()) {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.n_articulo.toLowerCase().includes(filtros.nombre.toLowerCase())
            );
        }

        // Filtrar por categoría seleccionada
        if (filtros.categoria) {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.categoria_FK === parseInt(filtros.categoria)
            );
        }

        // Filtrar por subcategoría seleccionada
        if (filtros.subcategoria) {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.scategoria_FK === parseInt(filtros.subcategoria)
            );
        }

        setProductosFiltrados(productosFiltrados);
    }, [productos, filtros]);

    // Función para manejar cambios en los filtros
    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => {
            const nuevosFiltros = { ...prev, [campo]: valor };
            
            // Si cambia la categoría, limpiar subcategoría para evitar inconsistencias
            if (campo === 'categoria') {
                nuevosFiltros.subcategoria = '';
            }
            
            return nuevosFiltros;
        });
    };

    // Función para limpiar todos los filtros aplicados
    const limpiarFiltros = () => {
        setFiltros({
            nombre: '',
            categoria: '',
            subcategoria: ''
        });
    };

    // Función para agregar un producto al carrito del usuario
    const handleAgregarAlCarrito = async (productoId) => {
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://192.168.1.116:5000';
            const cantidadSeleccionada = cantidad[productoId] || 1; // Usar cantidad seleccionada o 1 por defecto
            
            // Enviar solicitud para agregar producto al carrito
            const response = await fetch(`${backendUrl}/api/carritos/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Incluir cookies de autenticación
                body: JSON.stringify({
                    productoId,
                    cantidad: cantidadSeleccionada
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('UNAUTHORIZED'); // Usuario no autenticado
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            // Mostrar notificación de éxito
            setNotificacion({ visible: true, mensaje: 'Producto agregado exitosamente', tipo: 'success' });
            setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: '' }), 1000);
        } catch (error) {
            console.error('Error adding product to carrito:', error);

            // Manejar diferentes tipos de errores
            if (error.message === 'UNAUTHORIZED') {
                setNotificacion({ visible: true, mensaje: 'Inicie sesión para poder agregar al carrito', tipo: 'error' });
                setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: '' }), 2000);
            } else {
                setNotificacion({ visible: true, mensaje: 'Error al agregar el producto al carrito', tipo: 'error' });
                setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: '' }), 2000);
            }
        }
    };

    // Función para manejar cambios en la cantidad de un producto
    const handleCantidadChange = (productoId, nuevaCantidad) => {
        setCantidad(prev => ({ ...prev, [productoId]: nuevaCantidad }));
    };

    return (
        <div className="productos-container">
            <h1 className="productos-title">Tienda Virtual</h1>
    
            {/* Sistema de notificaciones flotantes */}
            {notificacion.visible && (
                <div className={`notificacion ${notificacion.tipo}`}>
                    {notificacion.mensaje}
                </div>
            )}

            {/* Sección de filtros para buscar productos */}
            <div className="filtros-container">
                {/* Barra de búsqueda por nombre */}
                <div className="filtro-busqueda">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={filtros.nombre}
                        onChange={(e) => handleFiltroChange('nombre', e.target.value)}
                        className="filtro-input"
                    />
                </div>
                
                {/* Filtros por categoría y subcategoría */}
                <div className="filtros-categorias">
                    <select
                        value={filtros.categoria}
                        onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                        className="filtro-select"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.ID_categoria} value={cat.ID_categoria}>
                                {cat.displayName || cat.n_categoria}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filtros.subcategoria}
                        onChange={(e) => handleFiltroChange('subcategoria', e.target.value)}
                        className="filtro-select"
                        disabled={!filtros.categoria} // Deshabilitar si no hay categoría seleccionada
                    >
                        <option value="">Todas las subcategorías</option>
                        {subcategorias.map(sub => (
                            <option key={sub.ID_subcate} value={sub.ID_subcate}>
                                {sub.displayName || sub.n_scategoria}
                            </option>
                        ))}
                    </select>

                    <button onClick={limpiarFiltros} className="limpiar-filtros-btn">
                        Limpiar filtros
                    </button>
                </div>
            </div>
    
            {/* Grid de productos filtrados */}
            <div className="productos-grid">
                {productosFiltrados.map(producto => (
                    <div key={producto.ID_producto} className="producto-card">
                        {/* Imagen del producto con fallback */}
                        <img 
                            src={producto.imagen || '/images/shop_cart.svg'} 
                            alt={producto.n_articulo} 
                            className="producto-imagen" 
                        />
                        <h2 className="producto-nombre">{producto.n_articulo}</h2>
                        <p className="producto-precio">${producto.precio.toFixed(2)} MXN</p>
                        
                        {/* Control de cantidad con botones + y - */}
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

            {/* Mensaje cuando no hay productos que coincidan con los filtros */}
            {productosFiltrados.length === 0 && productos.length > 0 && (
                <div className="no-productos">
                    <p>No se encontraron productos que coincidan con los filtros.</p>
                </div>
            )}
        </div>
    );
};

export default Productos;