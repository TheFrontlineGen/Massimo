const fs = require('fs');
const chalk = require('chalk');
var humanize = require('humanize-number');
const {
  Client, Collection, Intents, MessageEmbed,
} = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const intents = new Intents();
intents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS,
);
const client = new Client({ intents, partials: ['MESSAGE', 'REACTION'], allowedMentions: { parse: ['users'] } });
require('dotenv').config();
client.SlashCommands = new Collection();
const commandFiles = fs.readdirSync('./slashcmds').filter((file) => file.endsWith('.js'));
process.on('unhandledRejection', (error) => {
  console.log(error);
});
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require("node:fs");
const { join, resolve } = require("node:path");
const schedule = require('node-schedule');

// Event Handler

function loadCommands(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) loadCommands(path);
    else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") || entry.name.endsWith(".mjs"))
    ) {
      const command = require(resolve(path));
      client.SlashCommands.set(command.data.name, command);
    }
  }
}

loadCommands("./slashcmds");
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log(`${chalk.yellowBright('[WAIT] Refreshing Slash Commands')}`);
    await rest.put(Routes.applicationCommands(process.env.clientid), {
      body: client.SlashCommands.map((s) => s.data.toJSON()),
    });
    console.log(`${chalk.greenBright('[SUCCESS] Refreshed Slash Commands')}`);

  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', async () => {
  for (const file of commandFiles) {
    console.log(`${chalk.greenBright(`[SUCCESS] Slash Command Loaded: ${file}`)}`);
  }
    // Set bot's status
    let totalUsers = 0;
    client.guilds.cache.forEach(guild => {
      totalUsers += guild.memberCount;
    });
    client.user.setActivity(`over ${humanize(totalUsers)} users.`, { type: 'WATCHING' });
  
});
for (const file of commandFiles) {
  const command = require(`./slashcmds/${file}`);
  client.SlashCommands.set(command.data.name, command);
}

client.on('interactionCreate', async (interaction) => {
  const command = client.SlashCommands.get(interaction.commandName);
  if (!command) return;
  console.log(`${chalk.yellowBright(`[EVENT FIRED] Slash Command Ran: ${interaction.commandName}`)}`);

  // Logging command info to channel ID in guild ID
  const guild = client.guilds.cache.get('909845427124326490');
  const channel = guild.channels.cache.get('1128390679781970032');
  const runtime = process.hrtime();

  try {
    await command.execute(interaction, client);
    const elapsed = process.hrtime(runtime)[1] / 1000000;
    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Command Executed')
      .addField('Command', interaction.commandName, true)
      .addField('Runner', interaction.user.tag, true)
      .addField('Guild', interaction.guild.name, true)
      .addField('Guild ID', interaction.guild.id, true)
      .addField('Channel ID', interaction.channel.id, true)
      .addField('Run time', `${elapsed.toFixed(2)} ms`, true);
    channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    interaction.reply({
      embeds: [{
        description: `An error has occurred! Message <@928624781731983380> with this information: \n\`\`\`Command Name: ${interaction.commandName} \nError: ${error}\`\`\``
      }],
      ephemeral: true
    });
  }
});

// Login
client.login(process.env.TOKEN);
