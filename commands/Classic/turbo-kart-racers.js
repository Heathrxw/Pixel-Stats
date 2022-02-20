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
    .setName('turbo-kart-racers')
    .setDescription('Gets specified players Turbo Kart Racers statistics')
    .addStringOption(option => option.setName('username').setRequired(true).setDescription('The username of the player you want to get the statistics of')),

    async execute(interaction) {;
        const username = interaction.options.getString('username');
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const playerUUIDData = await uuid.json();
        hypixelAPIReborn.getPlayer(username).then((player) => {
            const Coins = (player.stats.turbokartracers.coins)
            const Laps = (player.stats.turbokartracers.completedLaps)
            const BoxPickups = (player.stats.turbokartracers.boxPickups)
            const BananaHits = (player.stats.turbokartracers.bananaHitsSent)
            const BananaReceived = (player.stats.turbokartracers.bananaHitsReceived)
            const goldTrophies = (player.stats.turbokartracers.goldTrophies)
            const silverTrophies = (player.stats.turbokartracers.silverTrophies)
            const bronzeTrophies = (player.stats.turbokartracers.bronzeTrophies)
            const Horn = (player.stats.turbokartracers.horn)
            const Wins = (player.stats.turbokartracers.wins)
            const tkr = new MessageEmbed()
            .setColor(color)
            .setTitle(`${player}'s Turbo Kart Racers Statistics`)
            .setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/TurboKartRacers-64.png')
            .addField('Coins', commaNumber(Coins), true)
            .addField('Laps', commaNumber(Laps), true)
            .addField('Top 3', commaNumber(Wins), true)
            .addField('Horn', (Horn), true)
            .addField('Bananas Hit', commaNumber(BananaHits), true)
            .addField('Bananas Received', commaNumber(BananaReceived), true)
            .addField('Box Pickups', commaNumber(BoxPickups), true)
            .addField('Gold Trophies', commaNumber(goldTrophies), true)
            .addField('Silver Trophies', commaNumber(silverTrophies), true)
            .addField('Bronze Trophies', commaNumber(bronzeTrophies), true)
            .setTimestamp()
            .setFooter({ text: footer, iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`  });
            interaction.reply({ embeds: [tkr] });
            con.query(`INSERT INTO TurboKartRacers (Mode,Username,Coins,Laps,BoxPickups,GoldTrophies,SilverTrophies,BronzeTrophies,Wins,Horn) VALUES ('TKR','${username}','${Coins}','${Laps}','${BoxPickups}','${goldTrophies}','${silverTrophies}','${bronzeTrophies}','${Wins}','${Horn}')`)
        }).catch((err) => {
            interaction.reply(`"${username}" is not a valid name! Are they nicked?`);
            console.log(err);
        })
    }
}
