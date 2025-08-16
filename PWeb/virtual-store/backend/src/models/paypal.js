// ===== CONFIGURACIÓN PAYPAL API =====
// Cliente PayPal SDK para procesar pagos online
const paypal = require('@paypal/checkout-server-sdk');

// Configuración del entorno PayPal en modo sandbox (desarrollo/pruebas)
const environment = new paypal.core.SandboxEnvironment(
    // Client ID de PayPal para aplicación sandbox
    'tu_id_Paypal_aqui',
    // Client Secret de PayPal (CONFIDENCIAL - para autenticación del servidor)
    'tu_token_aqui'
);

// Cliente HTTP configurado para comunicarse con la API de PayPal
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;