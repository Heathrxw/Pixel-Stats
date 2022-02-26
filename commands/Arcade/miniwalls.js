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
    .setName('mini-walls')
    .setDescription('Gets specified players Mini Walls statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const finalKills = (player.stats.arcade.miniWalls.finalKills)
            const witherKills = (player.stats.arcade.miniWalls.witherKills)
            const witherDamage = (player.stats.arcade.miniWalls.witherDamage)
            const arrowHits = (player.stats.arcade.miniWalls.arrowHits)
            const arrowShots = (player.stats.arcade.miniWalls.arrowShots)
            const bowAccuracy = (player.stats.arcade.miniWalls.bowAccuracy)
            const MiniWalls = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Mini Walls Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Arcade-64.png')
            .addField('Final Kills', commaNumber(finalKills), true)
            .addField('Wither Kills', commaNumber(witherKills), true)
            .addField('Wither Damage', commaNumber(witherDamage), true)
            .addField('Arrow Hits', commaNumber(arrowHits), true)
            .addField('Arrow Shots', commaNumber(arrowShots), true)
            .addField('Bow Accuracy', commaNumber(bowAccuracy), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png` });
            interaction.reply({ embeds: [MiniWalls] });
            con.query(`INSERT INTO MiniWalls (Mode,Username,finalKills,witherKills,witherDamage,arrowHits,arrowShots,bowAccuracy) VALUES ('MiniWalls','${username}','${finalKills}','${witherKills}','${witherDamage}','${arrowHits}','${arrowShots}','${bowAccuracy}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        });
        
    }
}