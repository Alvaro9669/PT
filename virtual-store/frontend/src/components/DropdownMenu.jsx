import React, { useState } from 'react';
import './DropdownMenu.css'; // Asegúrate de tener un archivo CSS para los estilos

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Alternar entre abierto y cerrado
    };

    return (
        <div className="dropdown-menu">
            <button onClick={toggleMenu} className="menu-button">
                Categorias
            </button>
            {isOpen && (
                <ul className="dropdown-list">
                    <li>Categoria 1</li>
                    <li>Categoria 2</li>
                    <li>Categoria 3</li>
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;