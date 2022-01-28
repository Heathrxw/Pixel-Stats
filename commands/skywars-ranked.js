const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelAPIReborn = require('../hypixel.js')
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const commaNumber = require('comma-number');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skywars-ranked')
    .setDescription('Gets specified players stats for ranked skywars statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const ranked = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Ranked Skywars Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
            .addField('Kills', commaNumber(player.stats.skywars.ranked.kills), true)
            .addField('Deaths', commaNumber(player.stats.skywars.ranked.deaths), true)
            .addField('Wins', commaNumber(player.stats.skywars.ranked.wins), true)
            .addField('Losses', commaNumber(player.stats.skywars.ranked.losses), true)
            .addField('KDR', commaNumber(player.stats.skywars.ranked.KDRatio), true)
            .addField('WLR', commaNumber(player.stats.skywars.ranked.WLRatio), true)
            .addField('Played Games', commaNumber(player.stats.skywars.ranked.playedGames), true)
            .setTimestamp()
            .setFooter({ text: footer });
            interaction.reply({ embeds: [ranked] });
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        });
    }
}