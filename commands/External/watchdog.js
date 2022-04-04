const { SlashCommandBuilder } = require('@discordjs/builders')
const hypixelAPIReborn = require('../../hypixel.js')
const { MessageEmbed } = require('discord.js')
const { color, footer } = require('../../config.json')
const commaNumber = require('comma-number')
const config = require('../../config.json')
const { createConnection } = require('mysql2')
let con = createConnection(config.mysql)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('watchdog')
    .setDescription('Gets the statistics for watchdog and staff bans'),

    async execute(interaction) {
        hypixelAPIReborn.getWatchdogStats().then((stats) => {
            const staff = (stats.byStaffTotal)
            const watchdog = (stats.byWatchdogTotal)
            const watchdogembed = new MessageEmbed()
            .setColor(color)
            .setTitle('Watchdog Statistics')
            .setThumbnail('https://i.heathrxw.xyz/hypixel.png')
            .addField('Watchdog Bans', commaNumber(watchdog), true)
            .addField('Staff Bans', commaNumber(staff), true)
            .setTimestamp()
            .setFooter({
                text: footer,
                iconURL: `https://i.heathrxw.xyz/hypixel.png`,
            });
            interaction.reply({ embeds: [watchdogembed] });
            con.query(
                `INSERT INTO Watchdog (WatchdogBans,StaffBans) VALUES ('${watchdog}','${staff}')`
            );
        })
        .catch((err) => {
            interaction.reply(
                `An error occured`
            );
            console.log(err);
        })
    }
}