// Importamos las clases necesarias de Discord.js para crear componentes de interfaz y gestionar permisos
const { 
  PermissionsBitField, // Para manejar permisos de canales y usuarios
  ActionRowBuilder,    // Para crear filas de componentes (botones, menús)
  ButtonBuilder,       // Para crear botones interactivos
  ButtonStyle,         // Estilos predefinidos para botones
  EmbedBuilder,        // Para crear mensajes embebidos (con formato rico)
  ChannelType          // Tipos de canales de Discord (texto, voz, categoría, etc.)
} = require('discord.js');

module.exports = {
  // Función para crear el botón de cerrar ticket
  createCloseButton: () => {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')      // ID único para identificar el botón cuando se presione
        .setLabel('Cerrar Ticket')        // Texto visible en el botón
        .setStyle(ButtonStyle.Danger)     // Estilo rojo (peligroso) para indicar acción destructiva
    );
  },

  // Función para crear el embed (mensaje con formato) que muestra información del ticket
  createTicketEmbed: (ticketData, articulosTexto, isUpdate = false) => {
    // Convertir la fecha del ticket a objeto Date de JavaScript
    const fechaObj = new Date(ticketData.fecha);

    // Formatear la fecha al formato mexicano (DD/MM/YYYY)
    const fechaFormateada = fechaObj.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Formatear la hora al formato de 24 horas (HH:MM)
    const horaFormateada = fechaObj.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // Crear y retornar el embed con toda la información del ticket
    return new EmbedBuilder()
    .setColor(0x0099FF)  // Color azul para el borde del embed
    .setTitle(`${isUpdate ? '📢 ' : ''}Ticket #${ticketData.ID_ticket}`)  // Título con emoji si es actualización
    .addFields(
      { name: 'Usuario', value: ticketData.n_usuario, inline: true },     // Mostrar nombre de usuario en línea
      { name: 'Fecha', value: fechaFormateada, inline: true },            // Mostrar fecha formateada en línea
      { name: 'Hora', value: ticketData.hora, inline: true },             // Mostrar hora en línea
      { name: 'Artículos', value: articulosTexto || 'No hay artículos' }, // Lista de artículos o mensaje por defecto
      { name: 'Total', value: `$${ticketData.total}` }                    // Total del ticket con símbolo de peso
    )
    .setFooter({ text: isUpdate ? 'Actualización automática' : 'Soporte Técnico' }); // Pie de página informativo
  },

  // Función principal para crear un canal de ticket privado
  crearCanalTicket: async (guild, ticketId, discordId) => {
    try {
      console.log(`[DEBUG] Intentando crear canal para ticket ID: ${ticketId}`);
  
      // Verificar si ya existe un canal para este ticket (evitar duplicados)
      const existingChannel = guild.channels.cache.find(c =>
        c.name === `ticket-${ticketId}` && c.parent?.name === 'Tickets'
      );
  
      if (existingChannel) {
        console.log(`[DEBUG] Canal existente encontrado: ${existingChannel.name}`);
        return existingChannel; // Retornar el canal existente en lugar de crear uno nuevo
      }
  
      // Buscar la categoría "Tickets" o crearla si no existe
      let category = guild.channels.cache.find(c =>
        c.name === 'Tickets' && c.type === ChannelType.GuildCategory
      );
  
      if (!category) {
        console.log('[DEBUG] Creando categoría "Tickets"');
        // Crear categoría con permisos restrictivos por defecto
        category = await guild.channels.create({
          name: 'Tickets',
          type: ChannelType.GuildCategory, // Tipo categoría para organizar canales
          permissionOverwrites: [
            {
              id: guild.id, // ID del servidor (rol @everyone)
              deny: [PermissionsBitField.Flags.ViewChannel] // Denegar ver la categoría a todos los usuarios
            }
          ]
        });
      }
  
      // Validar que el ID de Discord del usuario sea válido antes de crear el canal
      if (!discordId || typeof discordId !== 'string') {
        throw new Error(`El ID de usuario proporcionado no es válido: ${discordId}`);
      }
  
      // Crear el canal de ticket con permisos específicos
      console.log(`[DEBUG] Creando canal de ticket para ID: ${ticketId}`);
      const channel = await guild.channels.create({
        name: `ticket-${ticketId}`,     // Nombre del canal basado en el ID del ticket
        type: ChannelType.GuildText,    // Canal de texto normal
        parent: category.id,            // Colocar dentro de la categoría "Tickets"
        permissionOverwrites: [         // Configuración de permisos del canal
          {
            id: guild.id,               // Para todos los usuarios del servidor (@everyone)
            deny: [PermissionsBitField.Flags.ViewChannel] // DENEGAR: Ver el canal (canal privado)
          },
          {
            id: discordId,              // Para el usuario específico que creó el ticket
            allow: [
              PermissionsBitField.Flags.ViewChannel,    // PERMITIR: Ver el canal
              PermissionsBitField.Flags.SendMessages    // PERMITIR: Enviar mensajes
            ]
          },
          {
            id: guild.members.me.id,    // Para el bot (administrador del sistema)
            allow: [
              PermissionsBitField.Flags.ViewChannel,      // PERMITIR: Ver el canal
              PermissionsBitField.Flags.ManageChannels,   // PERMITIR: Gestionar canales (editar, eliminar)
              PermissionsBitField.Flags.SendMessages      // PERMITIR: Enviar mensajes
            ]
          }
        ]
      });

      console.log(`[DEBUG] Canal creado exitosamente: ${channel.name}`);
    return channel; // Retornar el canal creado para uso posterior
  } catch (error) {
    // Registrar errores detallados para facilitar el debugging
    console.error('[ERROR] Al crear el canal de ticket:', {
      message: error.message,
      guildId: guild.id,
      ticketId: ticketId,
      discordId: discordId
    });
    throw error; // Re-lanzar el error para que sea manejado por el código que llama esta función
    }
  }
};