import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './PaypalButton.css'; // Agrega estilos para el popup

const PaypalButton = ({ total }) => {
    const [popupMessage, setPopupMessage] = useState(null); // Estado para el mensaje emergente
    const [popupType, setPopupType] = useState(''); // Estado para el tipo de mensaje (success o error)

    const initialOptions = {
        "client-id": "AW4xEijNfSBJiSYtmMdYrfi3hdsva55HqfU45shxQn0f_RM4WUc-dNdjmw_XZ2fIDPrbvqZQZBSy4fQn", // Reemplaza con tu Client ID
        currency: "MXN",
    };

    return (
        <div>
            {/* Contenedor del popup */}
            {popupMessage && (
                <div className={`popup ${popupType}`}>
                    <p>{popupMessage}</p>
                </div>
            )}

            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: total.toFixed(2), // Total del carrito
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            // Convertir el total a flotante antes de enviarlo
                            const totalFloat = parseFloat(total);
                            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/paypal/capture-order`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include', // Asegurarse de que las cookies se envíen
                                body: JSON.stringify({ orderId: data.orderID, total: totalFloat }), // Enviar el total calculado
                            });

                            if (!response.ok) {
                                const errorResult = await response.json();
                                setPopupMessage(errorResult.message || 'Error al procesar el pago.');
                                setPopupType('error'); // Tipo de mensaje: error
                                setTimeout(() => setPopupMessage(null), 2000); // Ocultar popup después de 2 segundos
                                return;
                            }

                            const result = await response.json();
                            console.log('Respuesta del backend:', result);

                            if (result.success) {
                                setPopupMessage('Pago completado exitosamente');
                                setPopupType('success'); // Tipo de mensaje: éxito
                                setTimeout(() => {
                                    setPopupMessage(null);
                                    window.location.href = 'http://localhost:3000/carrito'; // Redirigir al carrito
                                }, 2000);
                            } else {
                                setPopupMessage(result.message || 'El pago no se completó.');
                                setPopupType('error'); // Tipo de mensaje: error
                                setTimeout(() => setPopupMessage(null), 2000);
                            }
                        } catch (error) {
                            console.error('Error al capturar el pago:', error);
                            setPopupMessage('Hubo un error al procesar el pago.');
                            setPopupType('error'); // Tipo de mensaje: error
                            setTimeout(() => setPopupMessage(null), 2000);
                        }
                    }}
                    onError={(err) => {
                        console.error('Error en el pago:', err);
                        setPopupMessage('Hubo un error al procesar el pago.');
                        setPopupType('error'); // Tipo de mensaje: error
                        setTimeout(() => setPopupMessage(null), 2000);
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default PaypalButton;