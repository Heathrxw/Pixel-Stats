const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelAPIReborn = require('../hypixel.js')
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const commaNumber = require('comma-number');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skywars-mega')
    .setDescription('Gets specified players stats for mega skywars statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const mega = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Mega Skywars Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
            .addField('Kills', commaNumber(player.stats.skywars.mega.overall.kills), true)
            .addField('Deaths', commaNumber(player.stats.skywars.mega.overall.deaths), true)
            .addField('Wins', commaNumber(player.stats.skywars.mega.overall.wins), true)
            .addField('Losses', commaNumber(player.stats.skywars.mega.overall.losses), true)
            .addField('KDR', commaNumber(player.stats.skywars.mega.overall.KDRatio), true)
            .addField('WLR', commaNumber(player.stats.skywars.mega.overall.WLRatio), true)
            .addField('Games Played', commaNumber(player.stats.skywars.mega.overall.playedGames), true)
            .setTimestamp()
            .setFooter({ text: footer });
            interaction.reply({ embeds: [mega] });
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        });
    }
}