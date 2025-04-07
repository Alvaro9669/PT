import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Verificar si la cookie 'user' está presente
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

        if (!cookies.user) {
            // Si no hay cookie 'user', no intentes obtener los datos del usuario
            console.warn('No user cookie found.');
            return;
        }

        // Obtener los datos del usuario desde el back-end
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, { withCredentials: true })
            .then(response => setUser(response.data))
            .catch(() => {
                console.warn('Failed to fetch user data.');
                setUser(null);
            });
    }, []);

    const handleLogout = () => {
        // Enviar solicitud al back-end para cerrar sesión
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {}, { withCredentials: true })
            .then(() => {
                setUser(null); // Limpiar el estado del usuario
                window.location.href = '/'; // Redirigir al home
            })
            .catch(err => console.error('Error during logout:', err));
    };

    if (!user) {
        return null; // No mostrar nada si el usuario no está autenticado
    }

    return (
        <div className="profile">
            <img src={user.avatar} alt="Avatar" />
            <p>ID: {user.id}</p>
            <p>Nickname: {user.username}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;