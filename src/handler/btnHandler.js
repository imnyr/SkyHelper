const d = require("discord.js");
const { shardLocation, shardTimeline, shardInfos, nextPrev } = require("@functions/shards");
const askQuestion = require("../functions/quiz/guessing");

/**
 * Handler for button interactions.
 * @param {import('discord.js').ButtonInteraction} interaction
 */
module.exports = async (interaction) => {
  if (!interaction.isButton()) return;
  const { client } = interaction;
  if (interaction.customId === "error_report") {
    const modal = new d.ModalBuilder().setCustomId("errorModal").setTitle("Bug Report");

    const commandUsed = new d.TextInputBuilder()
      .setCustomId("commandUsed")
      .setLabel("Name of the command.")
      .setPlaceholder("The command that produced the said error.")
      .setStyle(d.TextInputStyle.Short);

    const whatHappened = new d.TextInputBuilder()
      .setCustomId("whatHappened")
      .setLabel("Explain what happened?")
      .setStyle(d.TextInputStyle.Paragraph)
      .setPlaceholder("Explain in brief what happened. What outcome were you hoping?");

    const firstActionRow = new d.ActionRowBuilder().addComponents(commandUsed);
    const secondActionRow = new d.ActionRowBuilder().addComponents(whatHappened);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  }
  if (interaction.customId === "next" || interaction.customId === "prev") {
    const value = interaction.customId;
    await nextPrev(interaction, value);
  }
  if (interaction.customId.startsWith("timeline")) {
    const Zhii = await client.getUser("Zhii", "650487047160725508");
    const Christian = await client.getUser("Christian", "594485678625128466");
    shardTimeline(interaction, Zhii, Christian);
  }
  if (interaction.customId.startsWith("location")) {
    const Gale = await client.getUser("Gale", "473761854175576075");
    const Clement = await client.getUser("Clement", "693802004018888714");
    shardLocation(interaction, Gale, Clement);
  }
  if (interaction.customId.startsWith("about")) {
    const Art = await client.getUser("Art", "504605855539265537");
    shardInfos(interaction, Art);
  }

  if (interaction.customId.startsWith("play-again")) {
    if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(["SendMessages", "ViewChannel"])) {
      return interaction.reply({
        content: "I need `View Channel/Send Message` permissions in this channel for the command to work",
        ephemeral: true,
      });
    }

    if (interaction.client.gameData.get(interaction.channel.id)) {
      return interaction.reply({
        content: "There's already a game in progress in this channel",
        ephemeral: true,
      });
    }
    await interaction.deferUpdate();
    const total = interaction.customId.split("_")[1];
    await askQuestion(interaction, total);
  }
};