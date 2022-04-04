const { SlashCommandBuilder } = require('@discordjs/builders')
const hypixelAPIReborn = require('../../hypixel.js')
const { MessageEmbed } = require('discord.js')
const { color, footer } = require('../../config.json')
const commaNumber = require('comma-number')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Gets the statistics for a player')
        .addStringOption((option) =>
            option
            .setName('username')
            .setRequired(true)
            .setDescription('The username of the player you want to get the statistics of')
        ),

    async execute(interaction) {
        const username = interaction.options.getString('username');
        hypixelAPIReborn.getPlayer(username, { guild: true }).then(async (player) => {
            const playerUUID = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
            const playerUUIDData = await playerUUID.json();

            playerIsOnline = "";

            if (!player.isOnline) {
                playerIsOnline = "Offline"
            }

            if (player.isOnline) {
                playerIsOnline = "Online"
            }

            playerMinecraftVersion = "";

            if (player.mcVersion == null) {
                playerMinecraftVersion = "Unknown";
            }

            if (player.mcVersion != null) {
                playerMinecraftVersion = player.mcVersion;
            }

            playerRank = "";

            if (player.rank == 'Default') {
                playerRank = "None";
            }

            if (player.rank != 'Default') {
                playerRank = player.rank;
            }

            const firstLDate = new Date(player.firstLogin);
            const lastLDate = new Date(player.lastLogin);

            const firstL = firstLDate.toLocaleString()
            const lastL = lastLDate.toLocaleString()
            const pc = (player.plusColor.color)

            const playerInfoEmbed = new MessageEmbed()
                .setTitle('Player Stats')
                .setDescription(`[${player.rank}] ${player.nickname}`)
                .setColor(color)
                .setThumbnail(`https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`)
                .addField('Rank:', playerRank, true)
                .addField('Level:', commaNumber(player.level), true)
                .addField('Karma:', commaNumber(player.karma), true)
                .addField('Achievement Points:', commaNumber(player.achievementPoints), true)
                .setFooter({
                    text: footer,
                    iconURL: `https://i.heathrxw.xyz/hypixel.png`
                });

            if (player.guild != null) {
                playerInfoEmbed.addField('Guild:', player.guild.name, true)
            }

            playerInfoEmbed.addField('Main MC Version:', playerMinecraftVersion, true)
            playerInfoEmbed.addField('First Login:', (firstL), true)
            playerInfoEmbed.addField('Last Login:', (lastL), true)
            playerInfoEmbed.addField('Status:', playerIsOnline, true)

            if (player.rank.includes('MVP+')) {
                if (player.plusColor == null) {
                    playerInfoEmbed.addField('Plus Color:', 'Red')
                } else {
                    playerInfoEmbed.addField('Plus Color:', (pc), true)
                }
            }

            interaction.reply({embeds: [playerInfoEmbed]});
        }).catch((err) => {
            interaction.reply(`${username} is not a valid name! Are they nicked?`);
            console.log(err);
          });
    }
}