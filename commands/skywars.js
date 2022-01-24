const { SlashCommandBuilder } = require('@discordjs/builders');
const HypixelAPIReborn = require('hypixel-api-reborn')
const { MessageEmbed } = require('discord.js');
const { apikey, color, footer } = require('../config.json')
const hypixelAPIReborn = new HypixelAPIReborn.Client(apikey);
const commaNumber = require('comma-number');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skywars')
    .setDescription('Gets specified players skywars statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const skywarsEmbed = new MessageEmbed()
             .setColor(color)
             .setTitle(`${player}'s Skywars Statistics`)
             .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
             .addField('Kills', commaNumber(player.stats.skywars.kills), true)
             .addField('Deaths', commaNumber(player.stats.skywars.deaths), true)
             .addField('Wins', commaNumber(player.stats.skywars.wins), true)
             .addField('Losses', commaNumber(player.stats.skywars.losses), true)
             .addField('KDR', commaNumber(player.stats.skywars.KDRatio), true)
             .addField('WLR', commaNumber(player.stats.skywars.WLRatio), true)
             .addField('Total Coins', commaNumber(player.stats.skywars.coins), true)
             .addField('Total Tokens', commaNumber(player.stats.skywars.tokens), true)
             .addField('Level', commaNumber(player.stats.skywars.level), true)
             .addField('Heads', commaNumber(player.stats.skywars.heads), true)
             .addField('Prestige', commaNumber(player.stats.skywars.prestige), true)
             .addField('Souls', commaNumber(player.stats.skywars.souls), true)
             .setTimestamp()
             .setFooter({ text: footer });
            interaction.reply({ embeds: [skywarsEmbed] });
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`);
            console.log(err);
        });
    }
}