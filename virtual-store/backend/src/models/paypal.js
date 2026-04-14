const paypal = require('@paypal/checkout-server-sdk');

// Configuración del cliente PayPal
const environment = new paypal.core.SandboxEnvironment(
    'AW4xEijNfSBJiSYtmMdYrfi3hdsva55HqfU45shxQn0f_RM4WUc-dNdjmw_XZ2fIDPrbvqZQZBSy4fQn', // Reemplaza con tu Client ID
    'EDC2mhDEum2eKjuHSra2dYP-IkSadDC3vat-mv948-8-lq1A3K87NwrpWynVETN0naCWLAd-aHLXJbYR' // Reemplaza con tu Client Secret
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;