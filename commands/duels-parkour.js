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
    .setName('duels-parkour')
    .setDescription('Gets specified players stats for Parkour duels statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Division = (player.stats.duels.parkour.division)
            const Deaths = (player.stats.duels.parkour.deaths)
            const Wins = (player.stats.duels.parkour.wins)
            const Losses = (player.stats.duels.parkour.losses)
            const WLR = (player.stats.duels.parkour.WLRatio)
            const playedGames = (player.stats.duels.parkour.playedGames)
            const parkour = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Parkour Duels Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png')
            .addField('Deaths', commaNumber(Deaths), true)
            .addField('Wins', commaNumber(Wins), true)
            .addField('Losses', commaNumber(Losses), true)
            .addField('WLR', commaNumber(WLR), true)
            .addField('Played Games', commaNumber(playedGames), true)
            .addField('Division', commaNumber(Division), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`  });
            interaction.reply({ embeds: [parkour] });
            con.query(`INSERT INTO Duels (Mode,Username,Deaths,Wins,Losses,WLR,playedGames,Division) VALUES ('Parkour','${username}','${Deaths}','${Wins}','${Losses}','${WLR}','${playedGames}','${Division}')`)
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        })
    }
}