import React, { useState, useEffect } from 'react';
import './DiscordLoginButton.css';
import CartIcon from './CartIcon'; // Asegúrate de que este componente esté correctamente exportado
import axios from 'axios';
import { Link } from 'react-router-dom';


const DiscordLoginButton = () => {
    const [user, setUser] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const [logoutTimeout, setLogoutTimeout] = useState(null);

    useEffect(() => {
        // Validar la autenticación del usuario con el backend
        const validateUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, { withCredentials: true });
                setUser(response.data); // Actualizar el estado con la información del usuario
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn('User is not authenticated.');
                }
                setUser(null); // Asegurarse de que el estado sea null si no está autenticado
            }
        };

        validateUser();
    }, []); // Ejecutar solo al montar el componente

    const handleLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
    };

    const handleLogout = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                window.location.href = '/'; // Redirigir al home
            })
            .catch(err => console.error('Error during logout:', err));
    };

    const handleMouseEnter = () => {
        if (logoutTimeout) {
            clearTimeout(logoutTimeout);
            setLogoutTimeout(null);
        }
        setShowLogout(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowLogout(false);
        }, 1000);
        setLogoutTimeout(timeout);
    };

    return (
        <div className="discord-login-container">
            {!user ? (
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
                    {/* Caja separada para el carrito */}
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
                        <img
                            src={user.avatar} // Usar directamente la URL del avatar enviada por el back-end
                            alt="User Avatar"
                            className="user-avatar"
                        />
                        <span className="user-nickname">
                            {user.username}
                        </span>
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