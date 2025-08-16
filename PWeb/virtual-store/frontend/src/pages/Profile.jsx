import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    // Estado para almacenar la información del usuario autenticado
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Función para obtener y verificar las cookies del navegador
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

        // Verificar si existe la cookie 'user' que indica autenticación
        if (!cookies.user) {
            console.warn('No user cookie found.');
            return; // Salir si no hay usuario autenticado
        }

        // Solicitar datos del usuario desde el backend para validar sesión
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, { withCredentials: true })
            .then(response => setUser(response.data)) // Establecer datos del usuario
            .catch(() => {
                console.warn('Failed to fetch user data.');
                setUser(null); // Limpiar estado si falla la verificación
            });
    }, []);

    // Función para cerrar sesión del usuario
    const handleLogout = () => {
        // Enviar solicitud de logout al backend para limpiar cookies del servidor
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {}, { withCredentials: true })
            .then(() => {
                setUser(null); // Limpiar el estado del usuario
                window.location.href = '/'; // Redirigir al home
            })
            .catch(err => console.error('Error during logout:', err));
    };

    // No mostrar nada si el usuario no está autenticado
    if (!user) {
        return null;
    }

    return (
        <div className="profile">
            {/* Avatar del usuario desde Discord */}
            <img src={user.avatar} alt="Avatar" />
            <p>ID: {user.id}</p>
            <p>Nickname: {user.username}</p>
            {/* Botón para cerrar sesión */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;