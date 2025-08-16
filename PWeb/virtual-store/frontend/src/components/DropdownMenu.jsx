import React, { useState } from 'react';
import './DropdownMenu.css';

// Componente de menú desplegable para categorías (actualmente no utilizado)
const DropdownMenu = () => {
    // Estado para controlar si el menú está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);

    // Función para alternar visibilidad del menú
    const toggleMenu = () => {
        setIsOpen(!isOpen); // Alternar entre abierto y cerrado
    };

    return (
        <div className="dropdown-menu">
            <button onClick={toggleMenu} className="menu-button">
                Categorias
            </button>
            {/* Mostrar lista de categorías solo si el menú está abierto */}
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