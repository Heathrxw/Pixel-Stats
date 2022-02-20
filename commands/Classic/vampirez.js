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
    .setName('vampirez')
    .setDescription('Gets specified players VampireZ statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const HKills = (player.stats.vampirez.human.kills)
            const HDeaths = (player.stats.vampirez.human.deaths)
            const HWins = (player.stats.vampirez.human.wins)
            const HKDR = (player.stats.vampirez.human.KDRatio)
            const ZKills = (player.stats.vampirez.zombie.kills)
            const VKills = (player.stats.vampirez.vampire.kills)
            const VDeaths = (player.stats.vampirez.vampire.deaths)
            const VKDR = (player.stats.vampirez.vampire.KDRatio)
            const Coins = (player.stats.vampirez.coins)
            const vampirez = new MessageEmbed()
             .setColor(color)
             .setTitle(`${player}'s VampireZ Statistics`)
             .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/VampireZ-64.png')
             .addField('Human Kills', commaNumber(HKills), true)
             .addField('Human Deaths', commaNumber(HDeaths), true)
             .addField('Human Wins', commaNumber(HWins), true)
             .addField('Human KDR', commaNumber(HKDR), true)
             .addField('Zombie Kills', commaNumber(ZKills), true)
             .addField('Vampire Kills', commaNumber(VKills), true)
             .addField('Vampire Deaths', commaNumber(VDeaths), true)
             .addField('Vampire KDR', commaNumber(VKDR), true)
             .addField('Total Coins', commaNumber(Coins), true)
             .setTimestamp()
             .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`   });
            interaction.reply({ embeds: [vampirez] });
            con.query(`INSERT INTO Vampirez (Mode,Username,HKills,HDeaths,HKDR,HWins,ZKills,VKills,VDeaths,VKDR,Coins) VALUES ('VampireZ','${username}','${HKills}','${HDeaths}','${HKDR}','${HWins}','${ZKills}','${VKills}','${VDeaths}','${VKDR}','${Coins}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        });
    }
}
