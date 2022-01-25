const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelAPIReborn = require('../hypixel.js')
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const commaNumber = require('comma-number');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skywars-teams')
    .setDescription('Gets specified players stats for team skywars statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const teams = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Team Skywars Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
            .addField('Kills', commaNumber(player.stats.skywars.team.overall.kills), true)
            .addField('Deaths', commaNumber(player.stats.skywars.team.overall.deaths), true)
            .addField('Wins', commaNumber(player.stats.skywars.team.overall.wins), true)
            .addField('Losses', commaNumber(player.stats.skywars.team.overall.losses), true)
            .addField('KDR', commaNumber(player.stats.skywars.team.overall.KDRatio), true)
            .addField('WLR', commaNumber(player.stats.skywars.team.overall.WLRatio), true)
            .addField('Played Games', commaNumber(player.stats.skywars.team.overall.playedGames), true)
            .setTimestamp()
            .setFooter({ text: footer });
            interaction.reply({ embeds: [teams] });
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        });
    }
}