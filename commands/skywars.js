const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const hypixelAPIReborn = require('../hypixel.js')
const commaNumber = require('comma-number');
const config = require('../config.json')
const { createConnection } = require('mysql');
let con = createConnection(config.mysql);
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skywars')
    .setDescription('Gets specified players skywars statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Kills = (player.stats.skywars.kills)
            const Deaths = (player.stats.skywars.deaths)
            const Wins = (player.stats.skywars.wins)
            const Losses = (player.stats.skywars.losses)
            const KDR = (player.stats.skywars.KDRatio)
            const WLR = (player.stats.skywars.WLRatio)
            const Coins = (player.stats.skywars.coins)
            const Tokens = (player.stats.skywars.tokens)
            const Level = (player.stats.skywars.level)
            const Heads = (player.stats.skywars.heads)
            const Prestige = (player.stats.skywars.prestige)
            const Souls = (player.stats.skywars.souls)
            const skywarsEmbed = new MessageEmbed()
             .setColor(color)
             .setTitle(`${player}'s Skywars Overall Statistics`)
             .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
             .addField('Kills', commaNumber(Kills), true)
             .addField('Deaths', commaNumber(Deaths), true)
             .addField('Wins', commaNumber(Wins), true)
             .addField('Losses', commaNumber(Losses), true)
             .addField('KDR', commaNumber(KDR), true)
             .addField('WLR', commaNumber(WLR), true)
             .addField('Total Coins', commaNumber(Coins), true)
             .addField('Total Tokens', commaNumber(Tokens), true)
             .addField('Level', commaNumber(Level), true)
             .addField('Heads', commaNumber(Heads), true)
             .addField('Prestige', commaNumber(Prestige), true)
             .addField('Souls', commaNumber(Souls), true)
             .setTimestamp()
             .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`   });
            interaction.reply({ embeds: [skywarsEmbed] });
            con.query(`INSERT INTO SkywarsOverall (username,Kills,Deaths,Wins,Losses,KDR,WLR,Coins,Tokens,Level,Heads,Prestige,Souls) VALUES ('${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${Coins}','${Tokens}','${Level}','${Heads}','${Prestige}','${Souls}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        });
    }
}