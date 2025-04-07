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
                Menu
            </button>
            {isOpen && (
                <ul className="dropdown-list">
                    <li>Category 1</li>
                    <li>Category 2</li>
                    <li>Category 3</li>
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;