const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const hypixelAPIReborn = require('../hypixel.js')
const commaNumber = require('comma-number');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skywars-solo-normal')
    .setDescription('Gets specified players stats for solo normal skywars statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const soloNormal = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Solo Normal Skywars Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
            .addField('Kills', commaNumber(player.stats.skywars.solo.normal.kills), true)
            .addField('Deaths', commaNumber(player.stats.skywars.solo.normal.deaths), true)
            .addField('Wins', commaNumber(player.stats.skywars.solo.normal.wins), true)
            .addField('Losses', commaNumber(player.stats.skywars.solo.normal.losses), true)
            .addField('WLR', commaNumber(player.stats.skywars.solo.normal.WLRatio), true)
            .addField('KDR', commaNumber(player.stats.skywars.solo.normal.KDRatio), true)
            .setTimestamp()
            .setFooter({text: footer });
            interaction.reply({ embeds: [soloNormal] });
        }).catch((err) =>{
            interaction.reply(`${username} is not a valid name! Are they nicked?`);
            console.log(err)
        })
    }
}