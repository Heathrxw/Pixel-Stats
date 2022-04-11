const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { color, footer } = require("../../config.json");
const hypixelAPIReborn = require("../../hypixel.js");
const commaNumber = require("comma-number");
const config = require("../../config.json");
const { createConnection } = require("mysql2");
let con = createConnection(config.mysql);
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pvp-run")
    .setDescription("Gets specified players PvP Run statistics")
    .addStringOption((option) =>
      option
        .setName("username")
        .setRequired(true)
        .setDescription(
          "The username of the player you want to get the statistics of"
        )
    ),

  async execute(interaction) {
    const username = interaction.options.getString("username");
    const uuid = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${username}`
    );
    const playerUUIDData = await uuid.json();
    hypixelAPIReborn
      .getPlayer(username)
      .then((player) => {
        const Kills = player.stats.tntgames.pvprun.kills;
        const Wins = player.stats.tntgames.pvprun.wins;
        const Deaths = player.stats.tntgames.pvprun.deaths;
        const WLR = player.stats.tntgames.pvprun.KDRatio;
        const Record = player.stats.tntgames.pvprun.record;
        const pvprun = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s PVP Run Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/TNT-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Quickest Win (Seconds)", commaNumber(Record), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [pvprun] });
        con.query(
          `INSERT INTO TNTGames (Mode,Username,Kills,Wins,Deaths,WLR,Record) VALUES ('PVPRun','${username}','${Kills}','${Wins}','${Deaths}','${WLR}','${Record}')`
        );
      })
      .catch((err) => {
        interaction.reply(
          `"${username}" is not a valid name! Are they nicked?`
        );
        console.log(err);
      });
  },
};
