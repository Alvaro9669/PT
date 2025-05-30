import React from 'react';
import './ModalDiscord.css';

const ModalDiscord = ({ open, onClose, qrUrl, inviteUrl }) => {
    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (e.target.className === 'discord-modal-backdrop') {
            onClose();
        }
    };

    return (
        <div className="discord-modal-backdrop" onClick={handleBackdropClick}>
            <div className="discord-modal-content">
                <h2>¡Únete a nuestro servidor de Discord!</h2>
                <img src={qrUrl} alt="QR Discord" className="discord-qr" />
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