const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelAPIReborn = require('../hypixel.js')
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const commaNumber = require('comma-number');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skywars-teams-normal')
    .setDescription('Gets specified players stats for teams normal skywars statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const teamsnormal = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Team Skywars Normal Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
            .addField('Kills', commaNumber(player.stats.skywars.team.normal.kills), true)
            .addField('Deaths', commaNumber(player.stats.skywars.team.normal.deaths), true)
            .addField('Wins', commaNumber(player.stats.skywars.team.normal.wins), true)
            .addField('Losses', commaNumber(player.stats.skywars.team.normal.losses), true)
            .addField('KDR', commaNumber(player.stats.skywars.team.normal.KDRatio), true)
            .addField('WLR', commaNumber(player.stats.skywars.team.normal.WLRatio), true)
            .setTimestamp()
            .setFooter({ text: footer });
            interaction.reply({ embeds: [teamsnormal] });
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        });
    }
}