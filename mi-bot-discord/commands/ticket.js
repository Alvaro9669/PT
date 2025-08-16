// Comando slash /ticket para crear canales de soporte
const { SlashCommandBuilder } = require('discord.js');
const { MessageFlags } = require('discord.js');      // Para flags de mensajes (ephemeral)
const db = require('../db');                          // Conexión a base de datos
const discordUtils = require('../discordUtils');     // Utilidades de Discord

// Exportar función que recibe el cliente del bot
module.exports = (client) => {
  return {
    // Definición del comando slash con sus parámetros
    data: new SlashCommandBuilder()
      .setName('ticket')                              // Nombre del comando: /ticket
      .setDescription('Crea un canal de soporte para un ticket')
      .addStringOption(option =>                      // Parámetro obligatorio: ID del ticket
        option.setName('ticket_id')
          .setDescription('Número de ticket')
          .setRequired(true)),
    
    // Función que se ejecuta cuando alguien usa el comando
    execute: async (interaction) => {
      
    // Diferir respuesta para tener más tiempo de procesamiento (evita timeout)
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
      
      // Obtener y validar el ID del ticket ingresado por el usuario
      const ticketId = parseInt(interaction.options.getString('ticket_id'), 10);
      if (isNaN(ticketId)) return interaction.editReply('❌ El ID debe ser un número');
      
      const userId = interaction.user.id; // ID de Discord del usuario que ejecuta el comando

      try {
        // Buscar el ticket en la base de datos
        const ticket = await db.getTicket(ticketId);
        if (!ticket) return interaction.editReply('❌ Ticket no encontrado');

        // Verificar que el usuario tiene acceso al ticket (seguridad)
        if (ticket.discord_id !== userId) {
          return interaction.editReply('⚠️ No tienes acceso a este ticket');
        }

        // Obtener el servidor de Discord y crear el canal
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const channel = await discordUtils.crearCanalTicket(guild, ticketId, userId);

        // Obtener artículos del ticket y formatearlos para mostrar
        const articulos = await db.getArticulosTicket(ticketId);
        const articulosTexto = articulos.map(a => 
          `• ${a.n_articulo} (x${a.cantidad}) - $${a.precio_compra}`
        ).join('\n');

        // Crear embed con información del ticket y botón de cerrar
        const embed = discordUtils.createTicketEmbed(ticket, articulosTexto);
        const closeButton = discordUtils.createCloseButton();

        // Enviar mensaje inicial en el canal de ticket
        await channel.send({
          content: `👋 Hola <@${userId}>`, // Mención de bienvenida
          embeds: [embed],
          components: [closeButton]
        }).catch(error => console.error('Error enviando mensaje al canal:', error));

        // Confirmar al usuario que el canal fue creado
        await interaction.editReply(`✅ Canal creado: ${channel}`);

      } catch (error) {
        // Log detallado del error para debugging
        console.error('[ERROR] Detalles del error:', {
            message: error.message,
            stack: error.stack,
            ticketId: ticketId,
            userId: userId
          });
        await interaction.editReply('❌ Error al crear el ticket');
      }
    }
  };
};