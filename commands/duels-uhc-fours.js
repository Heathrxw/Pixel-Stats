const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelAPIReborn = require('../hypixel.js')
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const commaNumber = require('comma-number');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('duels-uhc-fours')
    .setDescription('Gets specified players stats for Fours UHC duels overall statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const foursuhc = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Fours UHC Overall Duels Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png')
            .addField('Kills', commaNumber(player.stats.duels.uhc.fours.kills), true)
            .addField('Deaths', commaNumber(player.stats.duels.uhc.fours.deaths), true)
            .addField('Wins', commaNumber(player.stats.duels.uhc.fours.wins), true)
            .addField('Losses', commaNumber(player.stats.duels.uhc.fours.losses), true)
            .addField('KDR', commaNumber(player.stats.duels.uhc.fours.KDRatio), true)
            .addField('WLR', commaNumber(player.stats.duels.uhc.fours.WLRatio), true)
            .addField('Played Games', commaNumber(player.stats.duels.uhc.fours.playedGames), true)
            .addField('Winstreak', commaNumber(player.stats.duels.uhc.fours.winstreak), true)
            .addField('Best Winstreak', commaNumber(player.stats.duels.uhc.fours.bestWinstreak), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png` });
            interaction.reply({ embeds: [foursuhc] });
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        })
    }
}