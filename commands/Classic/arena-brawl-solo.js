const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../../config.json')
const hypixelAPIReborn = require('../../hypixel.js')
const commaNumber = require('comma-number');
const config = require('../../config.json')
const { createConnection } = require('mysql2');
let con = createConnection(config.mysql);
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('arena-brawl-solo')
    .setDescription('Gets specified players Arena Brawl 1v1 statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Kills = (player.stats.arena.mode.solo.kills)
            const Deaths = (player.stats.arena.mode.solo.deaths)
            const Wins = (player.stats.arena.mode.solo.wins)
            const Losses = (player.stats.arena.mode.solo.losses)
            const KDR = (player.stats.arena.mode.solo.KDRatio)
            const WLR = (player.stats.arena.mode.solo.WLRatio)
            const Coins = (player.stats.arena.coins)
            const arenasolo = new MessageEmbed()
             .setColor(color)
             .setTitle(`${player}'s Arena Brawl 1v1 Statistics`)
             .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Arena-64.png')
             .addField('Kills', commaNumber(Kills), true)
             .addField('Deaths', commaNumber(Deaths), true)
             .addField('Wins', commaNumber(Wins), true)
             .addField('Losses', commaNumber(Losses), true)
             .addField('KDR', commaNumber(KDR), true)
             .addField('WLR', commaNumber(WLR), true)
             .addField('Coins', commaNumber(Coins), true)
             .setTimestamp()
             .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`   });
            interaction.reply({ embeds: [arenasolo] });
            con.query(`INSERT INTO ArenaBrawl (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,Coins) VALUES ('Solo','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${Coins}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        });
    }
}
