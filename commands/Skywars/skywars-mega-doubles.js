const { SlashCommandBuilder } = require("@discordjs/builders");
const hypixelAPIReborn = require("../../hypixel.js");
const { MessageEmbed } = require("discord.js");
const { color, footer } = require("../../config.json");
const commaNumber = require("comma-number");
const config = require("../../config.json");
const { createConnection } = require("mysql2");
let con = createConnection(config.mysql);
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skywars-mega-doubles")
    .setDescription(
      "Gets specified players stats for doubles mega skywars statistics"
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
        const Kills = player.stats.skywars.mega.doubles.kills;
        const Deaths = player.stats.skywars.mega.doubles.deaths;
        const Wins = player.stats.skywars.mega.doubles.wins;
        const Losses = player.stats.skywars.mega.doubles.losses;
        const KDR = player.stats.skywars.mega.doubles.KDRatio;
        const WLR = player.stats.skywars.mega.doubles.WLRatio;
        const megadoubles = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Mega Doubles Skywars Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("WLR", commaNumber(WLR), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [megadoubles] });
        con.query(
          `INSERT INTO Skywars (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR) VALUES ('MegaDoubles','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}')`
        );
      })
      .catch((err) => {
        interaction.reply(`${username} is not a valid name! Are they nicked?`);
        console.log(err);
      });
  },
};
