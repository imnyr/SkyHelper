import { getTranslator } from "#src/i18n";
import {
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  WebhookClient,
  ChatInputCommandInteraction,
  ButtonStyle,
  ModalSubmitInteraction,
} from "discord.js";
const suggWb = process.env.SUGGESTION ? new WebhookClient({ url: process.env.SUGGESTION }) : undefined;
export async function getSuggestion(interaction: ChatInputCommandInteraction, t: ReturnType<typeof getTranslator>) {
  const client = interaction.client;
  const attachment = interaction.options.getAttachment("attachment");
  const modal = new ModalBuilder()
    .setCustomId("suggestionModal" + `-${interaction.id}`)
    .setTitle(t("commands.UTILS.RESPONSES.SUGGESTION_MODAL_TITLE"));

  const fields = {
    title: new TextInputBuilder()
      .setCustomId("title")
      .setLabel(t("commands.UTILS.RESPONSES.SUGGESTION_TITLE"))
      .setPlaceholder(t("commands.UTILS.RESPONSES.TITLE_PLACEHOLDER"))
      .setStyle(TextInputStyle.Short),
    suggestion: new TextInputBuilder()
      .setCustomId("suggestion")
      .setLabel(t("commands.UTILS.RESPONSES.SUGGESTION"))
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(t("commands.UTILS.RESPONSES.SUGGESTION_PLACEHOLDER")),
  };

  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(fields.title);
  const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(fields.suggestion);

  modal.addComponents(firstActionRow, secondActionRow);

  await interaction.showModal(modal);

  const filter = (i: ModalSubmitInteraction) => i.customId === `suggestionModal-${interaction.id}`;
  interaction
    .awaitModalSubmit({ filter, time: 2 * 60000 })
    .then((modalInt) => {
      const ti = modalInt.fields.getTextInputValue("title");
      const sugg = modalInt.fields.getTextInputValue("suggestion");
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${modalInt.user.username} made a suggestion`,
          iconURL: modalInt.user.displayAvatarURL(),
        })
        .addFields({ name: `Title`, value: ti }, { name: `Suggestion/Bug Report/ Others`, value: sugg })
        .setFooter({
          text: `SkyHelper`,
          iconURL: client.user.displayAvatarURL(),
        });
      if (attachment) {
        embed.setImage(attachment.url);
      }
      modalInt
        .reply({
          content: t("commands.UTILS.RESPONSES.RECIEVED"),
          embeds: [embed],
          ephemeral: true,
        })
        .then(() => {
          embed.addFields({
            name: "Server",
            value: `${modalInt.guild?.name || "Unknown"} (${modalInt.guild?.id || "Unknown"})`,
          });

          suggWb?.send({ embeds: [embed] });
        });
    })
    .catch((err) => client.logger.error(err));
}

export async function getChangelog(interaction: ChatInputCommandInteraction) {
  const comMen = (command: string, sub?: string) => {
    const com = interaction.client.application.commands.cache.find((cm) => cm.name === command);
    return `</${com!.name}${sub ? ` ${sub}` : ""}:${com!.id}>`;
  };
  const changes = [
    `### New Commands:
  - **${comMen("spirits")}**: Search for detailed information about any spirits including trees, locations, realms, and emote previews.
  - **${comMen("traveling-spirit")}**: Access information about current or upcoming traveling spirits. If the current traveling spirit is unknown, it will provide an approximate return date for the next one.
  - **${comMen("guides")}**: Merged with \`seasonal-guides\` and now includes a \`realms\` subcommand for realm-based guides. An \`events\` guide is also planned for future addition (IDK when I'll add it tho lol).
    - **${comMen("guides", "seasonal")}**:  various seasonal guides.
    - **${comMen("guides", "realms")}**: various realms guides.
  - **${comMen("reminders")}**: Set up reminders for various in-game times such as grandma, reset, and turtle events. (Requires \`Manage Webhook\` permission). Daily quest reminder is still a work in progress.
  - Not yet added but a quiz game command is also work in progress based on Sky: CoTL (need to just add the question), will probably add them in the next update.
  `,
    `### Other Major Changes:
  - Transitioned Live Updates feature to utilize webhooks instead of channel IDs. It will require reconfiguration to function properly.
  - Introduced reminders feature, enabling users to receive notifications for various in-game times.
  - Restructured the guides command to include options for reducing the number of choices required after execution.
  
  *For previous/detailed changelogs, checkout the release page on GitHub **[here](https://github.com/imnaiyar/SkyHelper/releases)**.*`,
  ];
  const { client } = interaction;
  let page = 0;
  const total = changes.length - 1;
  const getEmbed = () => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Changelog`, iconURL: client.user.displayAvatarURL() })
      .setColor("Gold")
      .setTitle(`Changelog v5.5.0`)
      .setDescription(changes[page])
      .setImage("https://cdn.imnaiyar.site/warning-img.png")
      .setFooter({ text: `v5.0.0 - Page ${page + 1}/${total + 1}` });
    const btns = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("chng-prev")
        .setEmoji("1207594669882613770")
        .setDisabled(page === 0)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setEmoji("1222364414037200948")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("sidbwkss")
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("chng-next")
        .setEmoji("1207593237544435752")
        .setStyle(ButtonStyle.Success)
        .setDisabled(page === total),
    );
    if (total) {
      return { embeds: [embed], components: [btns] };
    } else {
      return { embeds: [embed] };
    }
  };
  const msg = await interaction.reply({ ...getEmbed(), ephemeral: true, fetchReply: true });
  if (!total) return;
  const collector = msg.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    idle: 3 * 60 * 1000,
  });
  collector.on("collect", async (int) => {
    const Id = int.customId;
    if (Id === "chng-next") {
      page++;
      const respn = getEmbed();
      await int.update(respn);
    }
    if (Id === "chng-prev") {
      page--;
      const respn = getEmbed();
      await int.update(respn);
    }
  });
  collector.on("end", async () => {
    await interaction.editReply({ components: [] });
  });
}
