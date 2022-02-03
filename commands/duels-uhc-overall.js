const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelAPIReborn = require('../hypixel.js')
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const commaNumber = require('comma-number');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('duels-uhc-overall')
    .setDescription('Gets specified players stats for uhc duels overall statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const uhc = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s UHC Overall Duels Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png')
            .addField('Kills', commaNumber(player.stats.duels.uhc.overall.kills), true)
            .addField('Deaths', commaNumber(player.stats.duels.uhc.overall.deaths), true)
            .addField('Wins', commaNumber(player.stats.duels.uhc.overall.wins), true)
            .addField('Losses', commaNumber(player.stats.duels.uhc.overall.losses), true)
            .addField('KDR', commaNumber(player.stats.duels.uhc.overall.KDRatio), true)
            .addField('WLR', commaNumber(player.stats.duels.uhc.overall.WLRatio), true)
            .addField('Played Games', commaNumber(player.stats.duels.uhc.overall.playedGames), true)
            .addField('Winstreak', commaNumber(player.stats.duels.uhc.overall.winstreak), true)
            .addField('Best Winstreak', commaNumber(player.stats.duels.uhc.overall.bestWinstreak), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`  });
            interaction.reply({ embeds: [uhc] });
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        })
    }
}