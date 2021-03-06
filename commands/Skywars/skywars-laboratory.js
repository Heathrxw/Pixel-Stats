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
    .setName("skywars-laboratory")
    .setDescription(
      "Gets specified players stats for skywars laboratory statistics"
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
        const Kills = player.stats.skywars.lab.kills;
        const Deaths = player.stats.skywars.lab.deaths;
        const Wins = player.stats.skywars.lab.wins;
        const Losses = player.stats.skywars.lab.losses;
        const KDR = player.stats.skywars.lab.KDRatio;
        const WLR = player.stats.skywars.lab.WLRatio;
        const playedGames = player.stats.skywars.lab.playedGames;
        const lab = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Laboratory Skywars Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Played Games", commaNumber(playedGames), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [lab] });
        con.query(
          `INSERT INTO Skywars (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,playedGames) VALUES ('Laboratory','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${playedGames}')`
        );
      })
      .catch((err) => {
        interaction.reply(`${username} is not a valid name! Are they nicked?`);
        console.log(err);
      });
  },
};
