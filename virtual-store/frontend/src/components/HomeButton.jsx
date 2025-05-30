import React from 'react';

const HomeButton = () => {
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