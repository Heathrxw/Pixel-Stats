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
    .setName('duels-arena')
    .setDescription('Gets specified players stats for Arena duels statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Kills = (player.stats.duels.arena.kills)
            const Deaths = (player.stats.duels.arena.deaths)
            const Wins = (player.stats.duels.arena.wins)
            const Losses = (player.stats.duels.arena.losses)
            const KDR = (player.stats.duels.arena.KDRatio)
            const WLR = (player.stats.duels.arena.WLRatio)
            const playedGames = (player.stats.duels.arena.playedGames)
            const arena = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Arena Duels Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png')
            .addField('Kills', commaNumber(Kills), true)
            .addField('Deaths', commaNumber(Deaths), true)
            .addField('Wins', commaNumber(Wins), true)
            .addField('Losses', commaNumber(Losses), true)
            .addField('KDR', commaNumber(KDR), true)
            .addField('WLR', commaNumber(WLR), true)
            .addField('Played Games', commaNumber(playedGames), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`  });
            interaction.reply({ embeds: [arena] });
            con.query(`INSERT INTO Duels (Mode,Username,Deaths,Wins,Losses,WLR,playedGames) VALUES ('Arena','${username}','${Deaths}','${Wins}','${Losses}','${WLR}','${playedGames}')`)
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        })
    }
}