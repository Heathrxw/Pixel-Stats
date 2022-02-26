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
    .setName('zombies')
    .setDescription('Gets specified players Zombies statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const zombieKills = (player.stats.arcade.zombies.overall.zombieKills)
            const deaths = (player.stats.arcade.zombies.overall.deaths)
            const bestRound = (player.stats.arcade.zombies.overall.bestRound)
            const doorsOpened = (player.stats.arcade.zombies.overall.doorsOpened)
            const fastestRound10 = (player.stats.arcade.zombies.overall.fastestRound10)
            const fastestRound20 = (player.stats.arcade.zombies.overall.fastestRound20)
            const fastestRound30 = (player.stats.arcade.zombies.overall.fastestRound30)
            const playersRevived = (player.stats.arcade.zombies.overall.playersRevived)
            const timesKnockedDown = (player.stats.arcade.zombies.overall.timesKnockedDown)
            const roundsSurvived = (player.stats.arcade.zombies.overall.roundsSurvived)
            const windowsRepaired = (player.stats.arcade.zombies.overall.windowsRepaired)
            const wins = (player.stats.arcade.zombies.overall.wins)
            const Zombies = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Zombies Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Arcade-64.png')
            .addField('Zombies kills', commaNumber(zombieKills), true)
            .addField('Deaths', commaNumber(deaths), true)
            .addField('Best Round', commaNumber(bestRound), true)
            .addField('Fastest Round 10 (Seconds)', commaNumber(fastestRound10), true)
            .addField('Fastest Round 20 (Seconds)', commaNumber(fastestRound20), true)
            .addField('Fastest Round 30 (Seconds)', commaNumber(fastestRound30), true)
            .addField('Doors Openeds', commaNumber(doorsOpened), true)
            .addField('Players Revived', commaNumber(playersRevived), true)
            .addField('Times Knocked Down', commaNumber(timesKnockedDown), true)
            .addField('Rounds Survived', commaNumber(roundsSurvived), true)
            .addField('Windows Repaired', commaNumber(windowsRepaired), true)
            .addField('Wins', commaNumber(wins), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png` });
            interaction.reply({ embeds: [Zombies] });
            con.query(`INSERT INTO Zombies (Mode,Username,zombieKills,deaths,bestRound,fastestRound10,fastestRound20,fastestRound30,doorsOpened,playersRevived,timesKnockedDown,roundsSurvived,windowsRepaired,wins) VALUES ('Zombies','${username}','${zombieKills}','${deaths}','${bestRound}','${fastestRound10}','${fastestRound20}','${fastestRound30}','${doorsOpened}','${playersRevived}','${timesKnockedDown}','${roundsSurvived}','${windowsRepaired}','${wins}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        });
        
    }
}