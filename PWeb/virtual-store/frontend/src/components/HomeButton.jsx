import React from 'react';

// Componente simple para botón de navegación al inicio
const HomeButton = () => {
    // Función para redirigir a la página principal
    const handleHomeClick = () => {
        window.location.href = '/'; // Redirige al inicio
    };

    return (
        <button onClick={handleHomeClick} className="home-button">
            Inicio
        </button>
    );
};

export default HomeButton;