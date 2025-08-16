// Módulo para gestionar notificaciones automáticas de tickets
const db = require('../db');                    // Conexión a la base de datos
const discordUtils = require('../discordUtils'); // Utilidades de Discord
const { EmbedBuilder } = require('discord.js');  // Para crear mensajes embebidos

module.exports = {
  // Función principal que inicia el sistema de notificaciones
  start: (client) => {
    // Ejecutar verificación cada 15 segundos (15000 ms)
    setInterval(async () => {
      try {
        // Buscar tickets que necesiten notificación (notificar = 1 en BD)
        const tickets = await db.checkNotificar();
        console.log(`[NOTIFICACIONES] Tickets pendientes: ${tickets.length}`);

        // Procesar cada ticket individualmente
        for (const ticket of tickets) {
          try {
            // Convertir discord_id a string para evitar problemas de tipo
            const discordId = ticket.discord_id?.toString();
            if (!discordId) {
              console.error(`El ticket ${ticket.ID_ticket} no tiene un discord_id válido.`);
              await db.resetNotificar(ticket.ID_ticket); // Resetear flag para evitar bucle infinito
              continue;
            }

            // Obtener el servidor de Discord configurado
            const guild = await client.guilds.fetch(process.env.GUILD_ID);

            // Verificar que el usuario sigue siendo miembro del servidor
            const member = await guild.members.fetch(discordId).catch(() => null);
            if (!member) {
              console.error(`El usuario con ID ${discordId} no está en el servidor.`);
              await db.resetNotificar(ticket.ID_ticket); // Resetear para evitar intentos futuros
              continue;
            }

            // Crear canal de ticket para el usuario (si no existe)
            const channel = await discordUtils.crearCanalTicket(guild, ticket.ID_ticket, discordId);

            // Obtener información completa del ticket desde la base de datos
            const ticketData = await db.getTicket(ticket.ID_ticket);
            const articulos = await db.getArticulosTicket(ticket.ID_ticket);
            
            // Formatear lista de artículos para mostrar en el embed
            const articulosTexto = articulos.map(a =>
              `• ${a.n_articulo} (x${a.cantidad}) - $${a.precio_compra}`
            ).join('\n');

            // Crear embed de actualización y botón de cerrar
            const embed = discordUtils.createTicketEmbed(ticketData, articulosTexto, true);
            const closeButton = discordUtils.createCloseButton();

            // Enviar mensaje en el canal con mención al usuario
            await channel.send({
              content: `<@${discordId}> 📢 Actualización del Ticket`, // Mención para notificar
              embeds: [embed],
              components: [closeButton]
            });

            // Intentar enviar mensaje directo al usuario
            try {
              const user = await client.users.fetch(discordId);
              await user.send({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`📢 Actualización del Ticket #${ticket.ID_ticket}`)
                    .setDescription('¡Hay nuevas actualizaciones en tu ticket!')
                    .setColor(0x0099FF) // Color azul consistente
                ]
              });
              console.log(`Notificación enviada por DM a ${user.tag}`);
            } catch (dmError) {
              // Error común: usuario tiene DMs deshabilitados
              console.error(`Error enviando DM a ${discordId}:`, dmError.message);
            }

            // Marcar ticket como notificado en la base de datos
            await db.resetNotificar(ticket.ID_ticket);

          } catch (error) {
            // Error específico del ticket - continuar con los demás
            console.error(`Error procesando ticket #${ticket.ID_ticket}: ${error.message}`);
            await db.resetNotificar(ticket.ID_ticket); // Resetear para evitar bucle
          }
        }
      } catch (error) {
        // Error general del sistema de notificaciones
        console.error('Error en el sistema de notificaciones:', error);
      }
    }, 15000); // Intervalo de 15 segundos
  }
};