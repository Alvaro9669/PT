# Punto de Venta Vinculado con un Bot de Discord

Sistema de punto de venta en línea integrado con un bot de Discord para gestión automatizada de compras y notificaciones.

## Requisitos del Sistema

- Node.js (versión 18 o superior)
- MySQL (versión 8.0 o superior)
- Una cuenta de Discord para crear la aplicación bot
- Una cuenta de PayPal Developer para pagos

## Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd CodigoPT
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 4. Instalar dependencias del bot

```bash
cd ../bot
npm install
```

## Configuración

### 1. Base de Datos MySQL

1. Crear una base de datos nueva:
```sql
CREATE DATABASE tienda_discord;
```

2. Importar el esquema de la base de datos:
```bash
mysql -u tu_usuario -p tienda_discord < database/schema.sql
```

### 2. Configuración del Backend

Crear archivo `.env` en la carpeta `backend/`:

```env
# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=tienda_discord
DB_PORT=3306

# Discord OAuth2
DISCORD_CLIENT_ID=tu_client_id_discord
DISCORD_CLIENT_SECRET=tu_client_secret_discord
DISCORD_REDIRECT_URI=http://localhost:5000/auth/discord/callback

# PayPal (usar credenciales sandbox para desarrollo)
PAYPAL_CLIENT_ID=tu_client_id_paypal_sandbox
PAYPAL_CLIENT_SECRET=tu_client_secret_paypal_sandbox

# Configuración del servidor
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Configuración del Frontend

Crear archivo `.env` en la carpeta `frontend/`:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_PAYPAL_CLIENT_ID=tu_client_id_paypal_sandbox
```

### 4. Configuración del Bot

Crear archivo `.env` en la carpeta `bot/`:

```env
# Bot Discord
DISCORD_TOKEN=tu_token_del_bot
DISCORD_CLIENT_ID=tu_client_id_discord
DISCORD_GUILD_ID=tu_server_id_discord

# Base de datos (misma configuración que backend)
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=tienda_discord
DB_PORT=3306
```

## Configuración de Discord

### 1. Crear aplicación Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token del bot para el archivo `.env`

### 2. Configurar OAuth2

1. En la sección "OAuth2", agrega la URL de redirección:
   - `http://localhost:5000/auth/discord/callback`
2. Selecciona los scopes: `identify` y `email`

### 3. Invitar el bot al servidor

1. En OAuth2 > URL Generator, selecciona:
   - Scopes: `bot` y `applications.commands`
   - Permisos: `Send Messages`, `Manage Channels`, `Create Private Threads`
2. Usa la URL generada para invitar el bot a tu servidor

## Configuración de PayPal

1. Ve a [PayPal Developer](https://developer.paypal.com/)
2. Crea una aplicación sandbox
3. Copia el Client ID y Client Secret para los archivos `.env`

## Ejecutar el Proyecto

### 1. Iniciar el backend

```bash
cd backend
npm start
```

El backend se ejecutará en `http://localhost:5000`

### 2. Iniciar el frontend

```bash
cd frontend
npm start
```

El frontend se ejecutará en `http://localhost:3000`

### 3. Iniciar el bot

```bash
cd bot
npm start
```

## Scripts Disponibles

### Backend
- `npm start` - Inicia el servidor en modo desarrollo
- `npm run dev` - Inicia con nodemon para recarga automática

### Frontend
- `npm start` - Inicia la aplicación React
- `npm run build` - Construye la aplicación para producción

### Bot
- `npm start` - Inicia el bot de Discord
- `npm run deploy` - Despliega los comandos slash al servidor

## Estructura del Proyecto

```
CodigoPT/
├── backend/          # Servidor Node.js/Express
├── frontend/         # Aplicación React
├── bot/             # Bot de Discord
├── database/        # Esquemas y datos de la base de datos
└── README.md
```

## Uso

1. **Acceso a la tienda**: Ve a `http://localhost:3000`
2. **Iniciar sesión**: Usa tu cuenta de Discord para autenticarte
3. **Explorar productos**: Navega y filtra productos disponibles
4. **Agregar al carrito**: Selecciona productos y cantidades
5. **Realizar compra**: Usa PayPal para completar la transacción
6. **Recibir notificación**: El bot enviará un mensaje en Discord con los detalles

## Comandos del Bot

- `/ticket <ticket_id>` - Consultar información de un ticket de compra

