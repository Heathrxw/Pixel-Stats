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
    .setName('build-battle')
    .setDescription('Gets specified players Build Battle statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Score = (player.stats.buildbattle.score)
            const playedGames = (player.stats.buildbattle.playedGames)
            const coins = (player.stats.buildbattle.coins)
            const totalVotes = (player.stats.buildbattle.totalVotes)
            const totalWins = (player.stats.buildbattle.totalWins)
            const SoloWins = (player.stats.buildbattle.wins.solo)
            const TeamWins = (player.stats.buildbattle.wins.team)
            const ProWins = (player.stats.buildbattle.wins.pro)
            const GTBWins = (player.stats.buildbattle.wins.gtb)
            const BuildBattle = new MessageEmbed()
             .setColor(color)
             .setTitle(`${player}'s Build Battle Statistics`)
             .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/BuildBattle-64.png')
             .addField('Score', commaNumber(Score), true)
             .addField('Played Games', commaNumber(playedGames), true)
             .addField('Coins', commaNumber(coins), true)
             .addField('Total Votes', commaNumber(totalVotes), true)
             .addField('Total Wins', commaNumber(totalWins), true)
             .addField('Solo Wins', commaNumber(SoloWins), true)
             .addField('Team Wins', commaNumber(TeamWins), true)
             .addField('Pro Wins', commaNumber(ProWins), true)
             .addField('Guess The Build Wins', commaNumber(GTBWins), true)
             .setTimestamp()
             .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`   });
            interaction.reply({ embeds: [BuildBattle] });
            con.query(`INSERT INTO BuildBattle (Mode,Username,Score,playedGames,coins,totalVotes,totalWins,SoloWins,TeamWins,ProWins,GTBWins) VALUES ('BuildBattle','${username}','${Score}','${playedGames}','${coins}','${totalVotes}','${totalWins}','${SoloWins}','${TeamWins}','${ProWins}','${GTBWins}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        });
    }
}
