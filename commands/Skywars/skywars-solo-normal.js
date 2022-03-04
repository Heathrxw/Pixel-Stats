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
    .setName("skywars-solo-normal")
    .setDescription(
      "Gets specified players stats for solo normal skywars statistics"
    )
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
        const Kills = player.stats.skywars.solo.normal.kills;
        const Deaths = player.stats.skywars.solo.normal.deaths;
        const Wins = player.stats.skywars.solo.normal.wins;
        const Losses = player.stats.skywars.solo.normal.losses;
        const KDR = player.stats.skywars.solo.normal.KDRatio;
        const WLR = player.stats.skywars.solo.normal.WLRatio;
        const soloNormal = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Solo Normal Skywars Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("KDR", commaNumber(WLR), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [soloNormal] });
        con.query(
          `INSERT INTO Skywars (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR) VALUES ('SoloNormal','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}')`
        );
      })
      .catch((err) => {
        interaction.reply(`${username} is not a valid name! Are they nicked?`);
        console.log(err);
      });
  },
};
