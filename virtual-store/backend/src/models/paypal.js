const paypal = require('@paypal/checkout-server-sdk');

// Configuración del cliente PayPal
const environment = new paypal.core.SandboxEnvironment(
    'AW4xEijNfSBJiSYtmMdYrfi3hdsva55HqfU45shxQn0f_RM4WUc-dNdjmw_XZ2fIDPrbvqZQZBSy4fQn', // Reemplaza con tu Client ID
    'EHImBnGzLdVWSoPaIC58AwOKHfbHV9s8S9nA79PB5yTJfnd4EF_AgOw0iENOk39YW9L5A9B_fISZwPPP' // Reemplaza con tu Client Secret
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;