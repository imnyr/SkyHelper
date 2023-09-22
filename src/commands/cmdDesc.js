module.exports = {
  shards: 'Provides detailed information about shattering shards in Sky: Children of the Light.\n\n`Usage:`\n/shards [date]\n- `[date]:` (Optional) Specify a date to get shard details for that day (e.g., "2023-09-15").\n\nThis command will give you insights into shard locations, landing times, and essential data for the selected date.',
  
  guides: `Provides guides for seasonal quests, locations of seasonal spirits, and their cosmetic price trees, created by fellow game players and including their credits. Results are ephemeral by default, but you can make them non-ephemeral optionally (only the results, select menu will still be ephemeral).

\`Usage:\`
/seasonal-guides [ephemeral]

- [ephemeral] (optional): Specify this option to receive non-ephemeral results.`,
  
  nextShards: `Provides information about the date and location of the next 5 upcoming shards by default. Optionally, you can request more results.

\`Usage:\`
/next-red [type] [number]
- [type] (optional): Specify the type of Shards to look for.
- [number] (optional): Specify the number of results you want (1 to 10 in server channels, 1 to 20 in DMs).

This command offers details on the date and location of the upcoming red shards. Use the optional [--number] flag to adjust the number of results.`,
  
  timestamp: `Converts a user-provided time into Unix time, using the default timezone (America/Los_Angeles) unless a different timezone is specified.

Usage:
!timestamp <time> [timezone] [date] [month] [year] [format]

- <time> (required): Specify the time you want to convert.
- [timezone] (optional): Specify a timezone to use for the conversion.
- [date] (optional): Specify a specific date (e.g., "2023-09-15").
- [month] (optional): Specify a specific month (e.g., "9").
- [year] (optional): Specify a specific year (e.g., "2023").
- [format] (optional): Specify the desired output format (e.g., "long-date", "short-date", "long-time-and-date", etc.).`,
  
  skytimes: `Provides times for various in-game events and resets in Sky: Children of the Light.

\`Usage:\`
/sky-times [times]

- [times]: (Optional) Specify a specific time to receive more detailed information about that event or reset (e.g., "geyser," "grandma," "turtle," "reset," "eden-reset").

This command offers a quick overview of the following times:
- Geyser time
- Grandma time
- Turtle time
- Reset time
- Eden reset time`,

   pSkytimes: `Provides times for various in-game events and resets in Sky: Children of the Light.

\`Usage:\`
sky-times [times]

- [times]: (Optional) Specify a specific time to receive more detailed information about that event or reset (e.g., "geyser," "grandma," "turtle," "reset," "eden").

This command offers a quick overview of the following times:
- Geyser time
- Grandma time
- Turtle time
- Reset time
- Eden reset time`,
  
  suggestion: 'Use this command to suggest any ideas, or if you like to suggest a change to an already existing feature.',
  
  skyGPT: `SkyGPT, built upon OpenAI's ChatGPT, is designed to assist with questions related to the game 'Sky: Children of the Light.' It embodies a playful and witty personality, drawing from training on Sky's data. Please note that ChatGPT's knowledge is current up to 2021, and it may occasionally provide incorrect information. For accuracy, consider verifying with other players. This feature is primarily for entertainment.
  
\`Usage:\`
- skygpt set #channel: Set up the bot to respond to messages in the specified channel.
- skygpt stop: Stop the bot's responses in all channels it's been configured for in a server.
 - Requires user to have \` Manage Server \` permission to configure this command.

The bot will respond to all messages in the designated channel as configured during setup. To make the bot ignore a message, simply prepend it with a '?'.`
}