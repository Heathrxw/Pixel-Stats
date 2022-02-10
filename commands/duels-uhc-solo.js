const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelAPIReborn = require('../hypixel.js')
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const commaNumber = require('comma-number');
const config = require('../config.json')
const { createConnection } = require('mysql2');
let con = createConnection(config.mysql);
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('duels-uhc-solo')
    .setDescription('Gets specified players stats for Solo UHC duels statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Kills = (player.stats.duels.uhc.solo.kills)
            const Deaths = (player.stats.duels.uhc.solo.deaths)
            const Wins = (player.stats.duels.uhc.solo.wins)
            const Losses = (player.stats.duels.uhc.solo.losses)
            const KDR = (player.stats.duels.uhc.solo.KDRatio)
            const WLR = (player.stats.duels.uhc.solo.WLRatio)
            const playedGames = (player.stats.duels.uhc.solo.playedGames)
            const Winstreak = (player.stats.duels.uhc.solo.winstreak)
            const bestWinstreak = (player.stats.duels.uhc.solo.bestWinstreak)
            const solouhc = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Solo UHC Duels Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png')
            .addField('Kills', commaNumber(Kills), true)
            .addField('Deaths', commaNumber(Deaths), true)
            .addField('Wins', commaNumber(Wins), true)
            .addField('Losses', commaNumber(Losses), true)
            .addField('KDR', commaNumber(KDR), true)
            .addField('WLR', commaNumber(WLR), true)
            .addField('Played Games', commaNumber(playedGames), true)
            .addField('Winstreak', commaNumber(Winstreak), true)
            .addField('Best Winstreak', commaNumber(bestWinstreak), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`  });
            interaction.reply({ embeds: [solouhc] });
            con.query(`INSERT INTO Duels (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,playedGames,Winstreak,bestWinstreak) VALUES ('UHCSolo','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${playedGames}','${Winstreak}','${bestWinstreak}')`)
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        })
    }
}