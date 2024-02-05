const { buildTimesEmbed } = require("@handler");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

/**
 * Updates SkyTimes details in all the registered guilds
 * @param {import('@src/structures').SkyHelper} client
 */
module.exports = async (client) => {
  const currentDate = moment().tz(client.timezone);
  const updatedAt = Math.floor(currentDate.valueOf() / 1000);
  const { result } = await buildTimesEmbed(client, "Live SkyTimes (updates every 2 min.)");

  const guildData = mongoose.model("autoTimes");
  const data = await guildData.find();
  if (!data) return;

  data.forEach((d) => {
    const channel = client.channels.cache.get(d.channelId);
    if (channel) {
      channel.messages.fetch(d.messageId).then((m) => {
        if (m && m.editable) {
          m.edit({
            content: `Last Updated: <t:${updatedAt}:R>`,
            embeds: [result],
          });
        }
      });
    }
  });
};
