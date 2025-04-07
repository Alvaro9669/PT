import React from 'react';

const HomeButton = () => {
    const handleHomeClick = () => {
        window.location.href = '/'; // Redirige al inicio
    };

    return (
        <button onClick={handleHomeClick} className="home-button">
            Home
        </button>
    );
};

export default HomeButton;