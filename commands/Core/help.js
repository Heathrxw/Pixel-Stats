const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed} = require('discord.js');
const {color, footer } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays Help Menu'),
    
    execute(interaction) {;
    
    let embed = new MessageEmbed()
    .setColor(color)
    .setTitle('Stats Pixel Help Menu')
    .setThumbnail('https://i.heathrxw.xyz/dNy5Vf.png')
    .addField('Welcome to the Stats Pixel Help Menu!', 'You can use the buttons below to cycle through the pages for the different commands!')
    .addField('Minigames', 'Use /(game) to get the stats for the specified game!')
    .addField('Specific', 'Use /(game)-(mode) to get the stats for the specified game and mode (will bring up specific commands)!')
    .addField('Valid Modes', 'The valid games so far are: Skywars and Duels')
    .setFooter({ text: 'Stats Pixel Help Menu, For more info visit https://heathrxw.xyz/t/statspixel'});
    interaction.reply({ embeds: [embed] });


    }
}