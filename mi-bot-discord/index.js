// Importar las clases principales de Discord.js para crear y gestionar el bot
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { REST, Routes } = require('discord.js'); // Para registrar comandos slash

// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

// Crear cliente del bot con intents específicos (permisos para recibir eventos)
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,         // Permite acceso a información del servidor
    GatewayIntentBits.GuildMessages,  // Permite leer mensajes del servidor
    GatewayIntentBits.MessageContent, // Permite leer el contenido de los mensajes
    GatewayIntentBits.DirectMessages, // Permite enviar/recibir mensajes directos
    GatewayIntentBits.GuildMembers    // Permite acceso a información de miembros
  ]
});

// Cargar módulos del sistema después de inicializar el cliente
const discordUtils = require('./discordUtils');               // Utilidades para Discord
const ticketCommand = require('./commands/ticket')(client);    // Comando /ticket con cliente
const ticketNotifier = require('./notifications/ticketNotifier'); // Sistema de notificaciones

// Iniciar el sistema de notificaciones automáticas cada 15 segundos
ticketNotifier.start(client);

// Evento que se ejecuta UNA VEZ cuando el bot se conecta exitosamente
client.once('ready', async () => {
  console.log(`Conectado como ${client.user.tag}`);
  
  // Registrar comandos slash en el servidor específico
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    // Registrar solo en el servidor configurado (más rápido que globalmente)
    await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), {
      body: [ticketCommand.data.toJSON()] // Convertir comando a formato JSON
    });
    console.log('Comandos registrados correctamente');
  } catch (error) {
    console.error('Error al registrar comandos:', error);
  }
});

// Evento que se ejecuta cada vez que hay una interacción (botones, comandos, etc.)
client.on('interactionCreate', async interaction => {
    // Manejar clic en botón "Cerrar Ticket"
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
      try {
        // Verificar que estamos en un canal de ticket válido
        if (!interaction.channel || !interaction.channel.name.startsWith('ticket-')) {
          return interaction.reply({ 
            content: '❌ Este no es un canal de ticket o el canal ya no existe', 
            flags: ['Ephemeral'] // Solo visible para quien presionó el botón
          });
        }        
  
        // Verificar que el bot tiene permisos para eliminar canales
        const botPermissions = interaction.channel.permissionsFor(client.user);
        if (!botPermissions.has(PermissionsBitField.Flags.ManageChannels)) {
          return interaction.reply({ 
            content: '❌ El bot necesita permisos de gestión de canales', 
            ephemeral: true 
          });
        }
  
        const channelName = interaction.channel.name; // Guardar nombre antes de eliminar
  
        // Confirmar al usuario que el canal será cerrado
        await interaction.reply({ 
            content: `✅ El canal **${channelName}** será cerrado.`,
            flags: ['Ephemeral'] // Mensaje temporal solo para el usuario
        });
  
         // Eliminar el canal con razón específica para logs de auditoría
            await interaction.channel.delete('Ticket cerrado por el usuario')
            .catch(async error => {
                console.error('Error al eliminar el canal:', error);
                // Enviar mensaje de seguimiento si falla la eliminación
                await interaction.followUp({
                content: '❌ Error al eliminar el canal',
                flags: ['Ephemeral']
                });
            });

        } catch (error) {
            console.error('[ERROR] Al cerrar ticket:', error);
            // Solo responder si no hemos respondido ya (evitar errores)
            if (!interaction.replied) {
            await interaction.reply({ 
                content: '❌ Error inesperado al cerrar el ticket', 
                flags: ['Ephemeral']
            });
        }
      }
    }

  // Manejar comando slash /ticket
  if (interaction.isChatInputCommand() && interaction.commandName === 'ticket') {
    try {
      await ticketCommand.execute(interaction); // Ejecutar lógica del comando
    } catch (error) {
      console.error('Error ejecutando comando /ticket:', error);
      // Responder con error solo si no se ha respondido antes
      if (!interaction.replied) {
        await interaction.reply({ content: '❌ Error ejecutando el comando', ephemeral: true });
      }
    }
  }
});

// Conectar el bot usando el token desde variables de entorno
client.login(process.env.DISCORD_TOKEN);