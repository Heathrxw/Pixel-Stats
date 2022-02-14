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
    .setName('bedwars')
    .setDescription('Gets specified players stats for Bedwars Overall statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const kills = (player.stats.bedwars.kills)
            const deaths = (player.stats.bedwars.deaths)
            const wins = (player.stats.bedwars.wins)
            const losses = (player.stats.bedwars.losses)
            const kdr = (player.stats.skywars.team.insane.KDRatio)
            const wlr = (player.stats.skywars.team.insane.WLRatio)
            const teamsinsane = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Team Skywars Insane Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
            .addField('Kills', commaNumber(kills), true)
            .addField('Deaths', commaNumber(deaths), true)
            .addField('Wins', commaNumber(wins), true)
            .addField('Losses', commaNumber(losses), true)
            .addField('KDR', commaNumber(kdr), true)
            .addField('WLR', commaNumber(wlr), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`});
            interaction.reply({ embeds: [teamsinsane] });
            con.query(`INSERT INTO Skywars (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR) VALUES ('TeamsInsane','${username}','${kills}','${deaths}','${wins}','${losses}','${kdr}','${wlr}')`)
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        });
    }
}
