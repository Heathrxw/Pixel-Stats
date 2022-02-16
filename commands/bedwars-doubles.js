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
    .setName('bedwars-doubles')
    .setDescription('Gets specified players stats for Bedwars Doubles statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const kills = (player.stats.bedwars.doubles.kills)
            const deaths = (player.stats.bedwars.doubles.kills)
            const wins = (player.stats.bedwars.doubles.wins)
            const losses = (player.stats.bedwars.doubles.losses)
            const kdr = (player.stats.bedwars.doubles.KDRatio)
            const wlr = (player.stats.bedwars.doubles.WLRatio)
            const winstreak = (player.stats.bedwars.doubles.winstreak)
            const avgkills = (player.stats.bedwars.doubles.avg.kills)
            const avgbeds = (player.stats.bedwars.doubles.avg.bedsBroken)
            const avgfinals = (player.stats.bedwars.doubles.avg.finalKills)
            const BedsBroke = (player.stats.bedwars.doubles.beds.broken)
            const BedsLost = (player.stats.bedwars.doubles.beds.lost)
            const BedsRatio = (player.stats.bedwars.doubles.beds.BLRatio)
            const bwdoubles = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Doubles Bedwars Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
            .addField('Kills', commaNumber(kills), true)
            .addField('Deaths', commaNumber(deaths), true)
            .addField('Wins', commaNumber(wins), true)
            .addField('Losses', commaNumber(losses), true)
            .addField('KDR', commaNumber(kdr), true)
            .addField('WLR', commaNumber(wlr), true)
            .addField('Winstreak', commaNumber(winstreak), true)
            .addField('Average Kills', commaNumber(avgkills), true)
            .addField('Average Beds Broken', commaNumber(avgbeds), true)
            .addField('Average Final Kills', commaNumber(avgfinals), true)
            .addField('Beds Broken', commaNumber(BedsBroke), true)
            .addField('Beds Lost', commaNumber(BedsLost), true)
            .addField('Beds Ratio', commaNumber(BedsRatio), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`});
            interaction.reply({ embeds: [bwdoubles] });
            con.query(`INSERT INTO Bedwars (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,Winstreak,AvgKills,AvgBeds,AvgFinals,BedsBroke,BedsLost,BedsRatio) VALUES ('DoublesBedwars','${username}','${kills}','${deaths}','${wins}','${losses}','${kdr}','${wlr}','${winstreak}','${avgkills}','${avgbeds}','${avgfinals}','${BedsBroke}','${BedsLost}','${BedsRatio}')`);
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        });
    }
}
