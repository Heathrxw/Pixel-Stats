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
    .setName("duels-skywars-doubles")
    .setDescription(
      "Gets specified players stats for Doubles Skywars duels statistics"
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
        const Kills = player.stats.duels.skywars.doubles.kills;
        const Deaths = player.stats.duels.skywars.doubles.deaths;
        const Wins = player.stats.duels.skywars.doubles.wins;
        const Losses = player.stats.duels.skywars.doubles.losses;
        const KDR = player.stats.duels.skywars.doubles.KDRatio;
        const WLR = player.stats.duels.skywars.doubles.WLRatio;
        const playedGames = player.stats.duels.skywars.doubles.playedGames;
        const Winstreak = player.stats.duels.skywars.doubles.winstreak;
        const bestWinstreak = player.stats.duels.skywars.doubles.bestWinstreak;
        const Division = player.stats.duels.skywars.doubles.division;
        const SWDoubles = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Doubles Skywars Duels Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Played Games", commaNumber(playedGames), true)
          .addField("Winstreak", commaNumber(Winstreak), true)
          .addField("Best Winstreak", commaNumber(bestWinstreak), true)
          .addField("Division", commaNumber(Division), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [SWDoubles] });
        con.query(
          `INSERT INTO Duels (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,playedGames,Winstreak,bestWinstreak,Division) VALUES ('SkywarsDoubles','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${playedGames}','${Winstreak}','${bestWinstreak}','${Division}')`
        );
      })
      .catch((err) => {
        interaction.reply(
          `${username} is not a valid name! Are they nicked? If not do /help`
        );
        console.log(err);
      });
  },
};
