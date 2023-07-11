const axios = require('axios');
const chalk = require('chalk');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkping')
    .setDescription('Check ping of Luckynet and Race-Life servers and find the optimal server for you.'),

  async execute(interaction, client) {
    if (interaction.guildId !== '793620741509218315' && interaction.guildId !== '968320703197745182' && !interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    try {
      const response = await axios.get('https://ping-api.frontlinegen.repl.co');
      const pingData = response.data;

      // Construct the content of the embed
      interaction.reply({
        embeds: [{
          author: {
            name: `Massimo`,
            icon_url: `https://cdn.discordapp.com/attachments/1102644532086059141/1128383192265666620/newnewnwq.png`,
            url: `https://massimo.race-life.net`
          },
          title: `Ping Results`,
          description: `**Race-Life:** ${pingData['race-life']}ms\n**Luckynet Racing:** ${pingData['luckynet']}ms\n\n **Test Region:** 🇺🇸 Iowa`,
          footer: {
            text: `Made with ❤️ by Frontline Genesis | twitter.com/thefrontlinegen`
          },
          color: '#FF5757'
        }],
        ephemeral: false
      });
    } catch (error) {
      console.error(`Failed to retrieve ping data from API: ${error}`);
      await interaction.reply({
        content: 'Failed to retrieve ping data from API. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
