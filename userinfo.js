// Declare Constant Variables
const { SlashCommandBuilder } = require('@discordjs/builders');
const chalk = require('chalk');
const https = require('https');
var humanize = require('humanize-number');

// Give Discord Command Data
module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription("Gets a user's info from ID or Username.")
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user ID you want to perform a lookup on.')
        .setRequired(true)),

  // Acknowledge Event
  async execute(interaction, client) {
    // Check if user is an administrator
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true
      });
    }

    const userId = interaction.options.getUser('user').id;
    const user = await client.users.fetch(userId);
    const member = await interaction.guild.members.fetch(user);

    // Get the names of the servers the user is in
    const guildNames = client.guilds.cache.filter(guild => guild.members.cache.has(user.id)).map(guild => guild.name);

  // Get users roles
    // Send Response
    try {
      interaction.reply({
        embeds: [{
          author: {
            name: `Race-Life`,
            icon_url: `https://cdn.discordapp.com/attachments/940019019082240030/1071933157718376448/image.png`,
            url: `https://race-life.net`
          },
          title: `${user.tag}`,
          description: `Here is some information about ${user}:`,
          fields: [
            {
              name: 'Username',
              value: `${user.username}`,
              inline: true
            },
            {
              name: 'Discriminator',
              value: `#${user.discriminator}`,
              inline: true
            },
            {
              name: 'ID',
              value: `${user.id}`,
              inline: true
            },
            {
              name: 'Account Creation',
              value: `<t:${Math.floor(user.createdAt.getTime() / 1000)}:d> (<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>)`,
              inline: true
            },
            {
              name: 'Joined',
              value: `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:d> (<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>)`,
              inline: true
            },
            {
              name: 'Roles',
              value: `${member.roles.cache.map(r => `${r}`).join('\n') || "No Roles Found"}`,
              inline: true
            },
            {
              name: 'Guilds',
              value: guildNames.length > 0 ? guildNames.join('\n') : 'Not in any guilds.',
              inline: false
            },
            {
              name: 'Permissions',
              value: `${member.permissions.toArray().join(', ')}`,
              inline: false
            },
          ],
          thumbnail: {
            url: `${user.displayAvatarURL()}`
          },
          footer: {
            text: `Made with ❤️ by Race-Life | race-life.net`
          },
          color: '#FF5757'
        }],
        ephemeral: true
      });
    } catch (err) {
      interaction.reply({
        embeds: [{
          description: `An error has occurred! Message <@928624781731983380> with this information: \n\`\`\`Command Name: ${interaction.comandName} \nError:\`\`\``
        }],
        ephemeral: true
      });
    }
  }
};
