import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import './PaypalButton.css';

const PaypalButton = ({ total }) => {
    // Estados para manejar notificaciones emergentes
    const [popupMessage, setPopupMessage] = useState(null); // Mensaje a mostrar
    const [popupType, setPopupType] = useState('');         // Tipo: 'success' o 'error'
    const navigate = useNavigate();

    // Configuración inicial del SDK de PayPal
    const initialOptions = {
        "client-id": "tu_id_Paypal_aqui", // Client ID de PayPal
        currency: "MXN", // Moneda mexicana
    };

    return (
        <div>
            {/* Popup para mostrar mensajes de éxito o error */}
            {popupMessage && (
                <div className={`popup ${popupType}`}>
                    <p>{popupMessage}</p>
                </div>
            )}

            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    // Función que se ejecuta al crear la orden de pago
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: total.toFixed(2), // Total del carrito con 2 decimales
                                    },
                                },
                            ],
                        });
                    }}
                    // Función que se ejecuta cuando PayPal aprueba el pago
                    onApprove={async (data, actions) => {
                        try {
                            // Convertir el total a flotante antes de enviarlo al backend
                            const totalFloat = parseFloat(total);
                            
                            // Enviar datos de la orden al backend para completar el pago
                            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/paypal/capture-order`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include', // Incluir cookies de autenticación
                                body: JSON.stringify({ orderId: data.orderID, total: totalFloat }),
                            });

                            if (!response.ok) {
                                const errorResult = await response.json();
                                setPopupMessage(errorResult.message || 'Error al procesar el pago.');
                                setPopupType('error');
                                setTimeout(() => setPopupMessage(null), 2000);
                                return;
                            }

                            const result = await response.json();
                            console.log('Respuesta del backend:', result);

                            if (result.success) {
                                // Pago exitoso - mostrar mensaje y recargar página
                                setPopupMessage('Pago completado exitosamente');
                                setPopupType('success');
                                setTimeout(() => {
                                    setPopupMessage(null);
                                    // Forzar recarga de página para actualizar estado del carrito
                                    window.location.reload();
                                }, 2000);
                            } else {
                                setPopupMessage(result.message || 'El pago no se completó.');
                                setPopupType('error');
                                setTimeout(() => setPopupMessage(null), 2000);
                            }
                        } catch (error) {
                            console.error('Error al capturar el pago:', error);
                            setPopupMessage('Hubo un error al procesar el pago.');
                            setPopupType('error');
                            setTimeout(() => setPopupMessage(null), 2000);
                        }
                    }}
                    // Función que maneja errores durante el proceso de pago
                    onError={(err) => {
                        console.error('Error en el pago:', err);
                        setPopupMessage('Hubo un error al procesar el pago.');
                        setPopupType('error');
                        setTimeout(() => setPopupMessage(null), 2000);
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default PaypalButton;