import React from 'react';
import './ModalDiscord.css';

// Componente modal para mostrar invitación al servidor de Discord
const ModalDiscord = ({ open, onClose, qrUrl, inviteUrl }) => {
    // No renderizar nada si el modal no está abierto
    if (!open) return null;

    // Función para cerrar el modal al hacer clic en el fondo
    const handleBackdropClick = (e) => {
        if (e.target.className === 'discord-modal-backdrop') {
            onClose();
        }
    };

    return (
        <div className="discord-modal-backdrop" onClick={handleBackdropClick}>
            <div className="discord-modal-content">
                <h2>¡Únete a nuestro servidor de Discord!</h2>
                {/* Código QR para unirse al servidor */}
                <img src={qrUrl} alt="QR Discord" className="discord-qr" />
                {/* Enlace directo al servidor de Discord */}
                <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="discord-link"
                >
                    Unirse al servidor
                </a>
            </div>
        </div>
    );
};

export default ModalDiscord;