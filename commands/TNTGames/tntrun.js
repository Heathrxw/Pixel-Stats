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
    .setName("tnt-run")
    .setDescription("Gets specified players TNT Run statistics")
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
        const Wins = player.stats.tntgames.tntrun.wins;
        const Deaths = player.stats.tntgames.tntrun.deaths;
        const WLR = player.stats.tntgames.tntrun.KDRatio;
        const Record = player.stats.tntgames.tntrun.record;
        const tntrun = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s TNT Run Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/TNT-64.png"
          )
          .addField("Wins", commaNumber(Wins), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Quickest Win (Seconds)", commaNumber(Record), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [tntrun] });
        con.query(
          `INSERT INTO TNTGames (Mode,Username,Wins,Deaths,WLR,Record) VALUES ('TNTRun','${username}','${Wins}','${Deaths}','${WLR}','${Record}')`
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
