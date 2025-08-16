import React, { useState, useEffect } from 'react';
import './DiscordLoginButton.css';
import CartIcon from './CartIcon';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DiscordLoginButton = () => {
    // Estados para manejar autenticación y UI
    const [user, setUser] = useState(null);           // Datos del usuario autenticado
    const [showLogout, setShowLogout] = useState(false); // Mostrar botón de logout
    const [logoutTimeout, setLogoutTimeout] = useState(null); // Timeout para ocultar logout

    useEffect(() => {
        // Función para validar si el usuario está autenticado al cargar el componente
        const validateUser = async () => {
            try {
                // Verificar autenticación con el backend
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, { withCredentials: true });
                setUser(response.data); // Establecer datos del usuario
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn('User is not authenticated.');
                }
                setUser(null); // Limpiar estado si no está autenticado
            }
        };

        validateUser();
    }, []);

    // Función para iniciar sesión con Discord
    const handleLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
    };

    // Función para cerrar sesión del usuario
    const handleLogout = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                window.location.href = '/'; // Redirigir al home
            })
            .catch(err => console.error('Error during logout:', err));
    };

    // Función para mostrar botón de logout al pasar el mouse
    const handleMouseEnter = () => {
        if (logoutTimeout) {
            clearTimeout(logoutTimeout);
            setLogoutTimeout(null);
        }
        setShowLogout(true);
    };

    // Función para ocultar botón de logout después de un tiempo
    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowLogout(false);
        }, 1000); // Ocultar después de 1 segundo
        setLogoutTimeout(timeout);
    };

    return (
        <div className="discord-login-container">
            {!user ? (
                // Mostrar botón de login si no hay usuario autenticado
                <button onClick={handleLogin} className="discord-login-button">
                    <img 
                        src="/images/discord.svg" 
                        alt="Discord Logo" 
                        className="discord-logo" 
                    />
                    Login with Discord
                </button>
            ) : (
                <>
                    {/* Caja separada para el ícono del carrito */}
                    <div className="cart-box">
                        <Link to="/carrito" className="cart-link">
                            <CartIcon isLoggedIn={!!user} />
                        </Link>
                    </div>
    
                    {/* Caja separada para la información del usuario */}
                    <div 
                        className="user-info"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Avatar del usuario desde Discord */}
                        <img
                            src={user.avatar} // URL del avatar proporcionada por el backend
                            alt="User Avatar"
                            className="user-avatar"
                        />
                        {/* Nickname del usuario */}
                        <span className="user-nickname">
                            {user.username}
                        </span>
                        {/* Botón de logout (visible al pasar el mouse) */}
                        {showLogout && (
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DiscordLoginButton;