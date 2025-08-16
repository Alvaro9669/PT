import React, { useState } from 'react';
import DropdownMenu from './DropdownMenu';
import HomeButton from './HomeButton';
import DiscordLoginButton from './DiscordLoginButton';
import ModalDiscord from './ModalDiscord';
import './HorizontalMenu.css';

// URLs para la invitación de Discord
const DISCORD_QR_URL = '/images/qrdiscord.svg'; 
const DISCORD_INVITE_URL = 'https://discord.gg/HsWEyQujQG'; 

// Componente de menú horizontal con efectos de blur basados en scroll
const HorizontalMenu = ({ blurAmount }) => {
    // Estado para controlar la visibilidad del modal de Discord
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <nav 
                className="horizontal-menu"
                style={{
                    // Variables CSS para efectos dinámicos basados en scroll
                    '--blur-amount': `${blurAmount}px`,      // Intensidad del blur
                    '--bg-opacity': `${Math.min(blurAmount * 0.03, 0.3)}` // Opacidad del fondo
                }}
            >
                <ul>
                    {/* Botón para ir al inicio */}
                    <li>
                        <HomeButton />
                    </li>
                    
                    {/* Botón para mostrar invitación a Discord */}
                    <li className="discord-join">
                        <button
                            className="discord-join-btn"
                            onClick={() => setModalOpen(true)}
                        >
                            <span style={{ color: '#5865F2', fontWeight: 700, fontSize: '1.1rem' }}>
                                {/* Icono de Discord */}
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="#5865F2" style={{verticalAlign: 'middle', marginRight: 6}}>
                                    <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.07.07 0 0 0-.073.035c-.211.375-.444.864-.608 1.249a18.524 18.524 0 0 0-5.487 0 12.51 12.51 0 0 0-.617-1.249.07.07 0 0 0-.073-.035 19.736 19.736 0 0 0-4.885 1.515.064.064 0 0 0-.03.027C.533 9.045-.32 13.579.099 18.057a.08.08 0 0 0 .031.056c2.052 1.507 4.041 2.422 5.993 3.029a.077.077 0 0 0 .084-.027c.461-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.104c-.652-.247-1.27-.549-1.872-.892a.077.077 0 0 1-.008-.127c.126-.094.252-.192.371-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.245.197.372.291a.077.077 0 0 1-.006.127 12.298 12.298 0 0 1-1.873.891.076.076 0 0 0-.04.105c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028c1.961-.607 3.95-1.522 6.002-3.029a.077.077 0 0 0 .031-.055c.5-5.177-.838-9.673-3.548-13.661a.061.061 0 0 0-.03-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z"/>
                                </svg>
                                Unirse al servidor
                            </span>
                        </button>
                    </li>
                    {/* Componente de login/logout con Discord */}
                    <li className="discord-login">
                        <DiscordLoginButton />
                    </li>
                </ul>
            </nav>
            {/* Modal para mostrar QR e invitación a Discord */}
            <ModalDiscord
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                qrUrl={DISCORD_QR_URL}
                inviteUrl={DISCORD_INVITE_URL}
            />
        </>
    );
};

export default HorizontalMenu;
