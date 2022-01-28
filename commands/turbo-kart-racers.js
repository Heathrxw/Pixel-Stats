const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {color, footer } = require('../config.json')
const hypixelAPIReborn = require('../hypixel.js')
const commaNumber = require('comma-number');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('turbo-kart-racers')
    .setDescription('Gets specified players turbo kart racers statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const tkr = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Turbo Kart Racers Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Turbo-Kart-Racers-64.png')
            .addField('Coins', commaNumber(player.stats.turbokartracers.coins), true)
            .addField('Laps', commaNumber(player.stats.turbokartracers.completedLaps), true)
            .addField('Box Pickups', commaNumber(player.stats.turbokartracers.boxPickups), true)
            .addField('Gold Trophies', commaNumber(player.stats.turbokartracers.goldTrophies), true)
            .addField('Silver Trophies', commaNumber(player.stats.turbokartracers.silverTrophies), true)
            .addField('Bronze Trophies', commaNumber(player.stats.turbokartracers.bronzeTrophies), true)
            .setTimestamp()
            .setFooter({ text: footer });
            interaction.reply({ embeds: [tkr] });
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        })
    }
}