const { WebhookClient, EmbedBuilder, Collection, } = require("discord.js");
const { DASHBOARD } = require("@root/config");
const ready = process.env.READY_LOGS ? new WebhookClient({ url: process.env.READY_LOGS }) : undefined;

/**
 * @param {import('@root/main')} client
 * @param {import('discord.js').Interaction} interaction
 */
module.exports = async (client, interaction) =>{
    const readyalertemb = new EmbedBuilder()
      .addFields(
        {
          name: "Bot Status",
          value: `Total guilds: ${client.guilds.cache.size}\nTotal Users: ${client.guilds.cache.reduce((size, g) => size + g.memberCount, 0)}`,
          inline: false,
        },
        {
          name: "Dashboard",
          value: `Dashboard started on port ${DASHBOARD.port}`,
          inline: false,
        },
        {
          name: "Interactions",
          value: `Loaded Interactions`,
          inline: false,
        },
        {
          name: "Success",
          value: `SkyBOT is now online`,
        }
      )
      .setColor('Gold')
      .setTimestamp();
  
    // Ready alert
    if (ready) {
      ready.send({
        username: "Ready",
        avatarURL: client.user.displayAvatarURL(),
        embeds: [readyalertemb],
      });
    }
  
  }