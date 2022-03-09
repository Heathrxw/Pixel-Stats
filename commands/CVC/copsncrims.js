const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelAPIReborn = require('../../hypixel.js')
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../../config.json')
const commaNumber = require('comma-number');
const config = require('../../config.json')
const { createConnection } = require('mysql2');
let con = createConnection(config.mysql);
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('copsncrims')
    .setDescription('Gets specified players stats for Cops n Crims statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Kills = (player.stats.copsandcrims.kills)
            const Deaths = (player.stats.copsandcrims.deaths)
            const Wins = (player.stats.copsandcrims.wins)
            const Losses = (player.stats.copsandcrims.losses)
            const KDR = (player.stats.copsandcrims.KDRatio)
            const WLR = (player.stats.copsandcrims.WLRatio)
            const Coins = (player.stats.copsandcrims.coins)
            const RoundWins = (player.stats.copsandcrims.roundWins)
            const ShotsFired = (player.stats.copsandcrims.shotsFired)
            const HeadshotKills = (player.stats.copsandcrims.headshotKills)
            const BombsDefused = (player.stats.copsandcrims.bombsDefused)
            const BombsPlanted = (player.stats.copsandcrims.bombsPlanted)
            const killsAsCrim = (player.stats.copsandcrims.killsAsCrim)
            const killsAsCop = (player.stats.copsandcrims.killsAsCop)
            const cvc = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Cops n Crims Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/CVC-64.png')
            .addField('Kills', commaNumber(Kills), true)
            .addField('Deaths', commaNumber(Deaths), true)
            .addField('Wins', commaNumber(Wins), true)
            .addField('Losses', commaNumber(Losses), true)
            .addField('KDR', commaNumber(KDR), true)
            .addField('WLR', commaNumber(WLR), true)
            .addField('Coins', commaNumber(Coins), true)
            .addField('Round Wins', commaNumber(RoundWins), true)
            .addField('Shots Fired', commaNumber(ShotsFired), true)
            .addField('Headshot Kills', commaNumber(HeadshotKills), true)
            .addField('Bombs Defused', commaNumber(BombsDefused), true)
            .addField('Bombs Planted', commaNumber(BombsPlanted), true)
            .addField('Kills as Crim', commaNumber(killsAsCrim), true)
            .addField('Kills as Cop', commaNumber(killsAsCop), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`  });
            interaction.reply({ embeds: [cvc] });
            con.query(`INSERT INTO CVC (Mode,Username,Deaths,Wins,Losses,WLR,Coins,roundWins,shotsFired,headshotKills,bombsDefused,bombsPlanted,killsAsCrim,killsAsCop) VALUES ('CVC','${username}','${Deaths}','${Wins}','${Losses}','${WLR}','${Coins}','${RoundWins}','${ShotsFired}','${HeadshotKills}','${BombsDefused}','${BombsPlanted}','${killsAsCrim}','${killsAsCop}')`)
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        })
    }
}