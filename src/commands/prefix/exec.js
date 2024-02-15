const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { exec } = require('child_process')
const util = require('util')

module.exports = {
  data: {
    name: "run",
    description: "runs commands on the console",
    category: "OWNER"
  },
   async execute(message, args) {
     message.channel.send({
      embeds:[
        new EmbedBuilder()
        .setTitle('Spawning Shell...')
        .setDescription(`Executing command...`)
        .setAuthor({ name: message.client.user.displayName, iconURL: message.client.user.displayAvatarURL() })
      ]
     })
    const script = args.join(" ");
    await run(script, message);
  },
}

async function run(script, message) {
    try {
    const { stdout } = await util.promisify(exec)(script, { maxBuffer: 10 * 1024 * 1024 }); // Set maxBuffer to 10 MB
    
    const total = stdout.length
    let currentPage = 1
    const totalWords = 1000
    const totalPages = Math.ceil( total / totalWords)


    
    const getResponse = () => {
    const start = (currentPage - 1) * totalWords;
    const end = start + totalWords < total ? start + totalWords : total;
    const result = stdout.slice(start, end)
    const outputEmbed = new EmbedBuilder()
    .setTitle('📥 Output')
    .setDescription(`\`\`\`bash\n${totalPages === 1 ? result : currentPage === 1 ? `${result}...` : currentPage === totalPages ? `...${result}` : `...${result}...`}\n\`\`\``)
    .setColor('Random')
    .setFooter({ text: `Page ${currentPage} of ${totalPages}`})
    .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("prv").setEmoji("<:left:1207594669882613770>").setStyle(ButtonStyle.Secondary).setDisabled(currentPage === 1 || totalPages === 1),
      new ButtonBuilder()
        .setCustomId("nxt")
        .setEmoji("<:right:1207593237544435752>")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === totalPages || totalPages === 1)
    )

    return ({ embeds: [outputEmbed], components: [row]})
    }
    const response = getResponse()
    const msg = await message.channel.send(response)
    if (totalPages === 1) return;
    const filter = (i) => {
      if (i.user.id !== message.author.id) {
        i.reply({
          content:
            "You can't use the menu generated by others.",
          ephemeral: true,
        });
        return false;
      }
      return true;
    };
  
    const collector = msg.createMessageComponentCollector({
      filter,
      idle: 1 * 60 * 1000
    })

    collector.on('collect', async (int) => {
      const id = int.customId
      switch (id) {
        case 'nxt':
          currentPage++
          await int.update(getResponse())
          break;
        case 'prv':
          currentPage--
          await int.update(getResponse())
      }
    })

    } catch (err) {
    const errorEmbed = new EmbedBuilder()
    .setTitle('☢️ Error')
    .setDescription(`\`\`\`bash\n${err}\n\`\`\``)
    .setColor('Random')
    .setTimestamp();
    await message.channel.send({ embeds: [errorEmbed]})
    }
}