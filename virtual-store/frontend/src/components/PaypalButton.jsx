import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalButton = ({ total }) => {
    const initialOptions = {
        "client-id": "AW4xEijNfSBJiSYtmMdYrfi3hdsva55HqfU45shxQn0f_RM4WUc-dNdjmw_XZ2fIDPrbvqZQZBSy4fQn", // Reemplaza con tu Client ID
        currency: "MXN",
    };
    // El valor total se pasa como prop al componente PaypalButton
    // Puedes cambiar la moneda a la que necesites, por ejemplo: "EUR", "MXN", etc.
    return (
        <PayPalScriptProvider options={initialOptions}>
            <div id="paypal-button-container">
                <PayPalButtons
                // Estilo del botón de PayPal
                    style={{ layout: "vertical",
                        shape: "rect",
                        label: "paypal",
                        height: 40, }}
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
                    // Función que se ejecuta al aprobar el pago
                    // Aquí puedes manejar la lógica después de que el pago se haya completado
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            alert(`Pago completado por ${details.payer.name.given_name}`);
                        });
                    }}
                    onError={(err) => {
                        console.error("Error en el pago:", err);
                        alert("Hubo un error al procesar el pago.");
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
};

export default PaypalButton;