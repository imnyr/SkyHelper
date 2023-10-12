const { ApplicationCommandOptionType } = require('discord.js');
const { helpMenu } = require('./sub/help');
module.exports = {
  data: {
    name: 'help',
    description: 'help menu',
    longDesc: 'List of all Slash and Prefix commands and their usage.',
    options: [
      {
        name: 'command',
        description: 'get help for a specific command',
        type: ApplicationCommandOptionType.String,
        require: false,
        autocomplete: true,
      },
    ],
  },
  async execute(interaction, client) {
    await helpMenu(interaction, client);
  },

  async autocomplete(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const choices = [
      'shards',
      'seasonal-guide',
      'next-shards',
      'timestamp',
      'sky-times',
      'credits',
      'ping',
    ];
    const filtered = choices.filter((choice) => choice.includes(focusedValue));
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },
};