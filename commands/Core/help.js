const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed} = require('discord.js');
const {color} = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays Help Menu'),
    
    execute(interaction) {;
    
    let embed = new MessageEmbed()
    .setColor(color)
    .setTitle('Stats Pixel Help Menu')
    .setThumbnail('https://i.heathrxw.xyz/hypixel.png')
    .addField('Welcome to the Stats Pixel Help Menu!', 'You can use the buttons below to cycle through the pages for the different commands!')
    .addField('Minigames', 'Use /(game) to get the stats for the specified game!')
    .addField('Specific', 'Use /(game)-(mode) to get the stats for the specified game and mode (will bring up specific commands)!')
    .addField('Valid Modes', 'The valid games so far are: Skywars and Duels')
    .addField('Bot Status', 'View the bot status here! https://status.heathrxw.xyz')
    .setFooter({ text: 'Stats Pixel Help Menu, For more info visit https://pixel-stats.heathrxw.xyz'});
    interaction.reply({ embeds: [embed] });
    }
}