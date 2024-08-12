import type { SeasonData } from "#libs/constants/seasonsData";
import { Spirits, SpiritsData, SeasonalSpiritData } from "#libs";
import type { SkyHelper } from "#structures";
import {
  ActionRowBuilder,
  ButtonInteraction,
  InteractionCollector,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  type ChatInputCommandInteraction,
} from "discord.js";

function isSeasonal(data: SpiritsData): data is SeasonalSpiritData {
  return "ts" in data;
}
export async function handleSpirits(int: ChatInputCommandInteraction, seasonOrRealm: SeasonData | string) {
  const client = int.client as SkyHelper;
  const t = await int.t();
  const spirits = Object.entries(client.spiritsData).filter(([, v]) => {
    if (typeof seasonOrRealm !== "string") {
      return isSeasonal(v) && v.season && v.season.toLowerCase() === seasonOrRealm.name.toLowerCase();
    }
    return v.realm && v.realm.toLowerCase() === seasonOrRealm.toLowerCase();
  });
  if (!spirits.length) {
    return await int.editReply(
      "Something went wrong! No spirits found for this season. If you think it's wrong, do let us know via" +
        " " +
        client.mentionCommand(await client.getCommand("utils"), "contact-us"),
    );
  }
  let value = spirits[0][0];
  const placehoder = typeof seasonOrRealm === "string" ? `${seasonOrRealm} Spirits` : `Season of ${seasonOrRealm.name}`;
  let sprtCltr: InteractionCollector<ButtonInteraction> | undefined;
  const getUpdate = async (i: StringSelectMenuInteraction | ChatInputCommandInteraction) => {
    const data = client.spiritsData[value];
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("spirit-select-menu")
        .setPlaceholder(placehoder)
        .addOptions(
          spirits.map(([k, v]) => ({
            label: v.name,
            value: k.toString(),
            emoji:
              v.action?.icon || v.call?.icon || v.emote?.icon || v.stance?.icon || v.icon || (seasonOrRealm as SeasonData).icon,
            default: value === k,
          })),
        ),
    );
    const manager = new Spirits(data, t, client);
    const btns = manager.getButtons();
    const msg = await i.editReply({
      embeds: [manager.getEmbed()],
      ...(btns.components?.length ? { components: [row, manager.getButtons()] } : { components: [row] }),
    });
    sprtCltr = await manager.handleInt(int);
    return msg;
  };
  const message = await getUpdate(int);
  const collector = message.createMessageComponentCollector({
    filter: (i) => i.customId === "spirit-select-menu" && i.isStringSelectMenu(),
  });
  collector.on("collect", async (stringInt: StringSelectMenuInteraction) => {
    if (stringInt.user.id !== int.user.id) {
      return void (await stringInt.reply({ content: "You cannot use menus generated by others!", ephemeral: true }));
    }
    await stringInt.deferUpdate();
    value = stringInt.values[0];
    if (sprtCltr) sprtCltr.stop("Guide Back");
    await getUpdate(stringInt);
  });
}
