# Frontend Virtual Store Documentation

## Overview
This is the frontend part of the Virtual Store project, built using React. The application features a user-friendly interface with a horizontal navigation menu, a dropdown menu for additional options, and a Discord login button for user authentication.

## Project Structure
The frontend project is organized as follows:

```
frontend
├── public
│   └── index.html          # Main HTML file for the React app
├── src
│   ├── components          # Contains all React components
│   │   ├── DropdownMenu.jsx  # Dropdown menu component
│   │   ├── HorizontalMenu.jsx # Main navigation menu component
│   │   ├── HomeButton.jsx     # Home button component
│   │   └── DiscordLoginButton.jsx # Discord login button component
│   ├── App.jsx              # Main application component
│   ├── index.js             # Entry point of the React application
│   └── styles
│       └── App.css         # Styles for the application
└── package.json             # NPM configuration for the frontend
```

## Features
- **Horizontal Menu**: A navigation bar that includes links to different sections of the application.
- **Dropdown Menu**: A component that provides additional navigation options.
- **Discord Login**: A button that allows users to log in using their Discord account via OAuth2.
- **Home Button**: A button that navigates users back to the home page.

## Getting Started
To run the frontend application, follow these steps:

1. Navigate to the `frontend` directory.
2. Install the dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Requerimientos Funcionales

- Permitir a los usuarios navegar por los productos disponibles en la tienda virtual.
- Permitir a los usuarios autenticarse mediante Discord (OAuth2).
- Permitir a los usuarios agregar productos al carrito de compras.
- Permitir a los usuarios modificar la cantidad de productos en el carrito y eliminar productos del mismo.
- Permitir a los usuarios realizar compras y generar tickets de compra usando PayPal.
- Mostrar notificaciones de éxito o error en las operaciones principales (login, agregar al carrito, compra).
- Permitir a los usuarios ver su perfil y cerrar sesión.
- Mostrar información relevante de los productos (nombre, imagen, precio, categoría).
- Permitir la navegación entre diferentes páginas (productos, carrito, perfil).
- Integración con un servidor de Discord (botón de invitación y QR).

## Requerimientos No Funcionales

- La aplicación debe ser responsiva y funcionar correctamente en dispositivos móviles y de escritorio.
- El frontend debe estar construido con React y utilizar buenas prácticas de componentes y manejo de estado.
- El sistema debe mantener la sesión del usuario mediante cookies seguras.
- El backend debe exponer una API RESTful y manejar la autenticación de manera segura.
- El sistema debe manejar errores y mostrar mensajes claros al usuario.
- El código debe estar organizado y documentado para facilitar el mantenimiento.
- El sistema debe ser escalable para permitir la integración de nuevas funcionalidades (por ejemplo, más métodos de pago, más categorías).
- El sistema debe proteger los datos sensibles y cumplir con buenas prácticas de seguridad (por ejemplo, no exponer secretos en el frontend).
- El backend debe soportar concurrencia y múltiples usuarios simultáneos.
- El sistema debe permitir la integración con servicios externos como Discord y PayPal.

# Virtual Store - Documentación de APIs

## API de Discord (OAuth2) para la tienda web

### ¿Qué hace?
Permite a los usuarios autenticarse en la tienda usando su cuenta de Discord mediante OAuth2. Al autenticarse:
- El usuario es redirigido a Discord para autorizar la aplicación.
- Tras autorizar, Discord redirige al backend con un código temporal.
- El backend intercambia ese código por un token y obtiene los datos del usuario desde Discord.
- Si el usuario no existe en la base de datos, se crea automáticamente.
- Se genera una cookie de sesión (`user`) con los datos básicos del usuario (id, username, avatar, email).
- El frontend puede leer esta cookie (vía endpoint `/auth/user`) para mostrar el perfil y mantener la sesión.

### Configuración
Debes registrar tu aplicación en el [Portal de Desarrolladores de Discord](https://discord.com/developers/applications) y obtener:
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI` (ejemplo: `http://localhost:5000/auth/discord/callback`)

Agrega estos valores en tu archivo `.env` del backend:

```env
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_REDIRECT_URI=http://localhost:5000/auth/discord/callback
FRONTEND_URL=http://localhost:3000
```

### Flujo y rutas principales

#### 1. Iniciar login con Discord
```http
GET /auth/login
```
- Redirige al usuario a la página de autorización de Discord.
- Se guarda un `state` aleatorio en una cookie para prevenir ataques CSRF.

#### 2. Callback de Discord OAuth2
```http
GET /auth/discord/callback
```
- Discord redirige aquí tras la autorización.
- El backend valida el `state` y obtiene el token de acceso.
- Se consulta la API de Discord para obtener los datos del usuario.
- Se guarda/actualiza el usuario en la base de datos.
- Se crea una cookie `user` con los datos básicos del usuario.
- Redirige al frontend.

#### 3. Obtener usuario autenticado
```http
GET /auth/user
```
- Devuelve los datos del usuario autenticado leyendo la cookie `user`.
- Si no hay cookie, responde 401.

#### 4. Logout
```http
POST /auth/logout
```
- Elimina la cookie `user` y termina la sesión.

### Ejemplo de uso en frontend (React):

```js
// Redirige al login de Discord
window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;

// Obtener usuario autenticado
axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, { withCredentials: true })
  .then(res => setUser(res.data));

// Logout
axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {}, { withCredentials: true })
  .then(() => setUser(null));
```

### ¿Qué datos se guardan en la cookie?
La cookie `user` contiene un JSON con:
```json
{
  "id": "discord_id",
  "username": "nombre_usuario",
  "avatar": "url_avatar_discord",
  "email": "correo@ejemplo.com"
}
```
Esta cookie es usada por el frontend para mostrar el perfil y por el backend para identificar al usuario en operaciones como agregar al carrito o comprar.

---

## API del Bot de Discord

### ¿Qué hace?
Permite automatizar acciones en el servidor de Discord, como responder comandos, enviar notificaciones de compras, dar roles, etc.

### Configuración
1. Crea un bot en el [Portal de Discord](https://discord.com/developers/applications).
2. Copia el token del bot y agrégalo a tu archivo `.env` del bot:

```env
DISCORD_BOT_TOKEN=...
```

3. Invita el bot a tu servidor con los permisos necesarios.

### Ejemplo de código básico (Node.js):

```js
// filepath: mi-bot-discord/bot.js
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.reply('¡Pong!');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

---

## API de PayPal

### ¿Qué hace?
Permite a los usuarios realizar pagos seguros en la tienda usando PayPal. Al completar el pago, se genera un ticket de compra y se vacía el carrito.

### Configuración
1. Crea una app en [PayPal Developer](https://developer.paypal.com/).
2. Obtén tu `Client ID` y `Client Secret` de sandbox.
3. Configura las credenciales en el backend:

```env
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### Uso en el backend

#### Ejemplo de endpoint para capturar orden (`src/routes/paypalRoutes.js`):

```js
// Captura una orden de PayPal y genera el ticket
POST /api/paypal/capture-order
Body: { orderId: string, total: number }
```

#### Ejemplo de uso en frontend (React):

```js
// Al completar el pago con PayPal, enviar el orderId y total al backend
axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/paypal/capture-order`, {
  orderId,
  total
}, { withCredentials: true })
.then(res => {
  // Mostrar mensaje de éxito y ticket
});
```

---

## Resumen

- **Discord OAuth2:** Autenticación de usuarios en la tienda web.
- **Bot de Discord:** Automatización y notificaciones en el servidor de Discord.
- **PayPal:** Procesamiento de pagos y generación de tickets de compra.

Consulta los archivos de rutas y controladores en el backend para ver la lógica detallada de cada API.