const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    let connection;
    
    try {
        console.log('🔄 Conectando al servidor MySQL...');
        
        // Conexión inicial sin especificar base de datos
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('✅ Conectado al servidor MySQL');

        // Crear la base de datos si no existe
        console.log(`🔄 Creando base de datos: ${process.env.DB_NAME}...`);
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`);
        console.log(`✅ Base de datos ${process.env.DB_NAME} creada exitosamente`);

        // Usar la base de datos creada
        await connection.execute(`USE \`${process.env.DB_NAME}\``);

        console.log('🔄 Creando tablas...');

        // Tabla usuarios (sin dependencias)
        console.log('📋 Creando tabla: usuarios');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`usuarios\` (
                \`ID_usuarios\` int NOT NULL AUTO_INCREMENT,
                \`discord_id\` bigint NOT NULL,
                \`correo\` varchar(255) NOT NULL,
                \`imagen\` blob,
                \`n_usuario\` varchar(45) DEFAULT NULL,
                PRIMARY KEY (\`ID_usuarios\`),
                UNIQUE KEY \`correo\` (\`correo\`),
                UNIQUE KEY \`discord_id_UNIQUE\` (\`discord_id\`)
            ) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);

        // Tabla categoria (sin dependencias)
        console.log('📋 Creando tabla: categoria');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`categoria\` (
                \`ID_categoria\` int NOT NULL AUTO_INCREMENT,
                \`n_categoria\` varchar(100) NOT NULL,
                PRIMARY KEY (\`ID_categoria\`)
            ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);

        // Tabla sub_categoria (depende de categoria)
        console.log('📋 Creando tabla: sub_categoria');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`sub_categoria\` (
                \`ID_subcate\` int NOT NULL AUTO_INCREMENT,
                \`n_scategoria\` varchar(100) NOT NULL,
                \`categoria_FK\` int DEFAULT NULL,
                PRIMARY KEY (\`ID_subcate\`),
                KEY \`categoria_FK\` (\`categoria_FK\`),
                CONSTRAINT \`sub_categoria_ibfk_1\` FOREIGN KEY (\`categoria_FK\`) REFERENCES \`categoria\` (\`ID_categoria\`) ON DELETE CASCADE
            ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);

        // Tabla producto (depende de categoria y sub_categoria)
        console.log('📋 Creando tabla: producto');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`producto\` (
                \`ID_producto\` int NOT NULL AUTO_INCREMENT,
                \`n_articulo\` varchar(100) NOT NULL,
                \`imagen\` longblob,
                \`precio\` float NOT NULL,
                \`categoria_FK\` int DEFAULT NULL,
                \`scategoria_FK\` int DEFAULT NULL,
                PRIMARY KEY (\`ID_producto\`),
                KEY \`categoria_FK\` (\`categoria_FK\`),
                KEY \`scategoria_FK\` (\`scategoria_FK\`),
                CONSTRAINT \`producto_ibfk_1\` FOREIGN KEY (\`categoria_FK\`) REFERENCES \`categoria\` (\`ID_categoria\`) ON DELETE SET NULL,
                CONSTRAINT \`producto_ibfk_2\` FOREIGN KEY (\`scategoria_FK\`) REFERENCES \`sub_categoria\` (\`ID_subcate\`) ON DELETE SET NULL
            ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);

        // Tabla carritos (depende de usuarios)
        console.log('📋 Creando tabla: carritos');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`carritos\` (
                \`ID_carritos\` int NOT NULL AUTO_INCREMENT,
                \`usuario_FK\` int DEFAULT NULL,
                PRIMARY KEY (\`ID_carritos\`),
                KEY \`usuario_FK\` (\`usuario_FK\`),
                CONSTRAINT \`carritos_ibfk_1\` FOREIGN KEY (\`usuario_FK\`) REFERENCES \`usuarios\` (\`ID_usuarios\`) ON DELETE CASCADE
            ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);

        // Tabla ticket (depende de usuarios)
        console.log('📋 Creando tabla: ticket');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`ticket\` (
                \`ID_ticket\` int NOT NULL AUTO_INCREMENT,
                \`usuario_FK\` int DEFAULT NULL,
                \`fecha\` date NOT NULL,
                \`hora\` time NOT NULL,
                \`total\` float NOT NULL,
                \`notificar\` tinyint(1) DEFAULT '0',
                PRIMARY KEY (\`ID_ticket\`),
                KEY \`usuario_FK\` (\`usuario_FK\`),
                CONSTRAINT \`ticket_ibfk_1\` FOREIGN KEY (\`usuario_FK\`) REFERENCES \`usuarios\` (\`ID_usuarios\`) ON DELETE CASCADE,
                CONSTRAINT \`ticket_chk_1\` CHECK ((\`total\` >= 0))
            ) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);

        // Tabla articulos_carrito (depende de carritos y producto)
        console.log('📋 Creando tabla: articulos_carrito');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`articulos_carrito\` (
                \`ID_articulosc\` int NOT NULL AUTO_INCREMENT,
                \`carrito_FK\` int DEFAULT NULL,
                \`producto_FK\` int DEFAULT NULL,
                \`cantidad\` int NOT NULL,
                PRIMARY KEY (\`ID_articulosc\`),
                KEY \`carrito_FK\` (\`carrito_FK\`),
                KEY \`producto_FK\` (\`producto_FK\`),
                CONSTRAINT \`articulos_carrito_ibfk_1\` FOREIGN KEY (\`carrito_FK\`) REFERENCES \`carritos\` (\`ID_carritos\`) ON DELETE CASCADE,
                CONSTRAINT \`articulos_carrito_ibfk_2\` FOREIGN KEY (\`producto_FK\`) REFERENCES \`producto\` (\`ID_producto\`) ON DELETE CASCADE,
                CONSTRAINT \`articulos_carrito_chk_1\` CHECK ((\`cantidad\` > 0))
            ) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);

        // Tabla articulos_ticket (depende de ticket y producto)
        console.log('📋 Creando tabla: articulos_ticket');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`articulos_ticket\` (
                \`ID_articulost\` int NOT NULL AUTO_INCREMENT,
                \`ticket_FK\` int DEFAULT NULL,
                \`producto_FK\` int DEFAULT NULL,
                \`cantidad\` int NOT NULL,
                \`precio_compra\` float NOT NULL,
                PRIMARY KEY (\`ID_articulost\`),
                KEY \`ticket_FK\` (\`ticket_FK\`),
                KEY \`producto_FK\` (\`producto_FK\`),
                CONSTRAINT \`articulos_ticket_ibfk_1\` FOREIGN KEY (\`ticket_FK\`) REFERENCES \`ticket\` (\`ID_ticket\`) ON DELETE CASCADE,
                CONSTRAINT \`articulos_ticket_ibfk_2\` FOREIGN KEY (\`producto_FK\`) REFERENCES \`producto\` (\`ID_producto\`) ON DELETE CASCADE,
                CONSTRAINT \`articulos_ticket_chk_1\` CHECK ((\`cantidad\` > 0)),
                CONSTRAINT \`articulos_ticket_chk_2\` CHECK ((\`precio_compra\` >= 0))
            ) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);

        console.log('✅ Todas las tablas han sido creadas exitosamente');
        
        // Insertar datos de ejemplo (opcional)
        console.log('🔄 Insertando datos de ejemplo...');
        
        // Categorías de ejemplo
        await connection.execute(`
            INSERT IGNORE INTO categoria (n_categoria) VALUES 
            ('Electrónicos'),
            ('Ropa')
        `);

        // Subcategorías de ejemplo
        await connection.execute(`
            INSERT IGNORE INTO sub_categoria (n_scategoria, categoria_FK) VALUES 
            ('Smartphones', 1),
            ('Laptops', 1),
            ('Camisetas', 2)
        `);

        console.log('✅ Datos de ejemplo insertados');
        console.log('🎉 ¡Base de datos configurada exitosamente!');

    } catch (error) {
        console.error('❌ Error al crear la base de datos:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar la función si el archivo se ejecuta directamente
if (require.main === module) {
    createDatabase();
}

module.exports = createDatabase;
