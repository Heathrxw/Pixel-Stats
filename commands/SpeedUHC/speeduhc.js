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
    .setName('speed-uhc')
    .setDescription('Gets specified players Speed UHC statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Kills = (player.stats.speeduhc.kills)
            const Deaths = (player.stats.speeduhc.deaths)
            const Wins = (player.stats.speeduhc.wins)
            const Losses = (player.stats.speeduhc.losses)
            const KDR = (player.stats.speeduhc.KDRatio)
            const WLR = (player.stats.speeduhc.WLRatio)
            const playedGames = (player.stats.speeduhc.playedGames)
            const Winstreak = (player.stats.speeduhc.winstreak)
            const Coins = (player.stats.speeduhc.coins)
            const speeduhc = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Speed UHC Overall Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/SpeedUHC-64.png')
            .addField('Kills', commaNumber(Kills), true)
            .addField('Deaths', commaNumber(Deaths), true)
            .addField('Wins', commaNumber(Wins), true)
            .addField('Losses', commaNumber(Losses), true)
            .addField('KDR', commaNumber(KDR), true)
            .addField('WLR', commaNumber(WLR), true)
            .addField('Played Games', commaNumber(playedGames), true)
            .addField('Winstreak', commaNumber(Winstreak), true)
            .addField('Coins', commaNumber(Coins), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png` });
            interaction.reply({ embeds: [speeduhc] });
            con.query(`INSERT INTO SpeedUHC (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,playedGames,Winstreak,Coins) VALUES ('SpeedUHC','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${playedGames}','${Winstreak}','${Coins}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        });
        
    }
}