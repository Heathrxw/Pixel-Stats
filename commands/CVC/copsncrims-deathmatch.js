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
    .setName('copsncrims-deathmatch')
    .setDescription('Gets specified players stats for Cops n Crims Deathmatch statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Kills = (player.stats.copsandcrims.deathmatch.kills)
            const Deaths = (player.stats.copsandcrims.deathmatch.deaths)
            const KDR = (player.stats.copsandcrims.deathmatch.KDRatio)
            const KillsAsCrim = (player.stats.copsandcrims.deathmatch.killsAsCrim)
            const KillsAsCop = (player.stats.copsandcrims.deathmatch.killsAsCop)
            const cvc = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Cops n Crims Deathmatch Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/CVC-64.png')
            .addField('Kills', commaNumber(Kills), true)
            .addField('Deaths', commaNumber(Deaths), true)
            .addField('KDR', commaNumber(KDR), true)
            .addField('Kills As Crim', commaNumber(KillsAsCrim), true)
            .addField('Kills As Cop', commaNumber(KillsAsCop), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`  });
            interaction.reply({ embeds: [cvc] });
            con.query(`INSERT INTO CVC (Mode,Username,Kills,Deaths,KDR,killsAsCrim,killsAsCop) VALUES ('CVCDeathmatch','${username}','${Kills}','${Deaths}','${KDR}','${KillsAsCrim}','${KillsAsCop}')`)
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`)
            console.log(err)
        })
    }
}