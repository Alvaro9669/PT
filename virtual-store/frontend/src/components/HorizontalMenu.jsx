import React from 'react';
import DropdownMenu from './DropdownMenu';
import HomeButton from './HomeButton';
import DiscordLoginButton from './DiscordLoginButton';
import './HorizontalMenu.css'; // Archivo CSS para estilos

const HorizontalMenu = () => {
    return (
        <nav className="horizontal-menu">
            <ul>
                <li className="home-button">
                    <HomeButton />
                </li>
                <li className="dropdown-menu">
                    <DropdownMenu />
                </li>
                <li className="discord-login">
                    <DiscordLoginButton />
                </li>
            </ul>
        </nav>
    );
};

export default HorizontalMenu;