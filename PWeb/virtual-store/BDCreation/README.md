# 🗄️ Base de Datos - Virtual Store con Bot Discord

Este directorio contiene los scripts necesarios para crear y configurar la base de datos del sistema de punto de venta integrado con Discord.

## 📋 Requisitos Previos

- **MySQL Server** (versión 5.7 o superior)
- **Node.js** (versión 14 o superior)
- **npm** (incluido con Node.js)

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
# o alternativamente
npm run install-deps
```

### 2. Configurar Variables de Entorno
1. Abre el archivo `.env` en este directorio
2. Modifica los valores según tu configuración de MySQL:

```env
DB_HOST=localhost          # Dirección del servidor MySQL
DB_PORT=3306              # Puerto de MySQL (por defecto 3306)
DB_USER=root              # Usuario de MySQL
DB_PASSWORD=tu_password   # CAMBIA ESTO por tu contraseña real
DB_NAME=virtual_store_db  # Nombre de la base de datos a crear
```

### 3. Ejecutar el Script de Creación
```bash
npm run create-db
# o directamente
node create_database.js
```

## 📊 Estructura de la Base de Datos

La base de datos está diseñada para soportar un sistema de e-commerce con las siguientes funcionalidades:

### 🔐 **Tabla `usuarios`**
Almacena información de los usuarios autenticados con Discord.
- **Características**: Un usuario puede tener múltiples tickets pero solo un carrito activo
- **Campos principales**: `discord_id`, `correo`, `n_usuario`, `imagen`

### 🛒 **Tabla `carritos`** (Temporal)
Gestiona el carrito de compras temporal de cada usuario.
- **Relación**: 1:1 con usuarios (un usuario = un carrito)
- **Comportamiento**: Se vacía automáticamente al completar la compra
- **Propósito**: Almacenamiento temporal de productos antes de la compra

### 🧾 **Tabla `ticket`** (Persistente)
Registra todas las compras realizadas en el sistema.
- **Relación**: 1:N con usuarios (un usuario = múltiples tickets)
- **Comportamiento**: Los datos son permanentes e inmutables
- **Campo especial**: `notificar` - Controla las notificaciones del bot Discord

### 📦 **Tabla `producto`**
Catálogo de productos disponibles en la tienda.
- **Organización**: Categorías y subcategorías jerárquicas
- **Campos**: `n_articulo`, `precio`, `imagen`, referencias a categorías

### 🏷️ **Tablas `categoria` y `sub_categoria`**
Sistema de clasificación de productos.
- **Estructura**: Categorías padre → subcategorías hijo
- **Ejemplo**: Electrónicos → Smartphones, Laptops

### 📋 **Tablas de Artículos**

#### `articulos_carrito` (Temporal)
- **Función**: Relaciona productos con carritos temporales
- **Datos**: `cantidad` de cada producto
- **Ciclo de vida**: Se elimina al finalizar la compra

#### `articulos_ticket` (Persistente)
- **Función**: Registro histórico de productos comprados
- **Datos**: `cantidad` y `precio_compra` (precio al momento de la compra)
- **Importancia**: Mantiene histórico de precios

## 🔄 Diferencias Clave: Carrito vs Ticket

| Aspecto | 🛒 Carrito | 🧾 Ticket |
|---------|------------|------------|
| **Permanencia** | Temporal | Permanente |
| **Relación Usuario** | 1:1 | 1:N |
| **Precio** | Precio actual | Precio histórico |
| **Propósito** | Compra en proceso | Compra completada |
| **Datos** | Se eliminan | Se conservan |
| **Bot Discord** | No notifica | Notifica automáticamente |

## 🤖 Integración con Discord Bot

### Campo `notificar` en Tickets
- **Valor inicial**: `1` (pendiente de notificación)
- **Proceso**: El bot Discord revisa periódicamente tickets con `notificar = 1`
- **Después de notificar**: Se actualiza a `0` (notificado)
- **Beneficio**: Garantiza que todas las compras sean notificadas, incluso si el bot se reinicia

## 📁 Archivos Incluidos

- `create_database.js` - Script principal de creación
- `.env` - Configuración de conexión a MySQL
- `package.json` - Dependencias del proyecto
- `README.md` - Esta documentación

