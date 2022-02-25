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
    .setName('football')
    .setDescription('Gets specified players Football statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const wins = (player.stats.arcade.soccer.wins)
            const kicks = (player.stats.arcade.soccer.kicks)
            const powerkicks = (player.stats.arcade.soccer.powerKicks)
            const goals = (player.stats.arcade.soccer.goals)
            const football = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Football Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Arcade-64.png')
            .addField('Kills', commaNumber(wins), true)
            .addField('Deaths', commaNumber(kicks), true)
            .addField('Wins', commaNumber(powerkicks), true)
            .addField('Losses', commaNumber(goals), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png` });
            interaction.reply({ embeds: [football] });
            con.query(`INSERT INTO Football (Mode,Username,Wins,Kicks,PowerKicks,Goals) VALUES ('Football','${username}','${wins}','${kicks}','${powerkicks}','${goals}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        });
        
    }
}