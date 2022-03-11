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
    .setName("duels-classic")
    .setDescription("Gets specified players stats for Classic duels statistics")
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
        const Kills = player.stats.duels.classic.kills;
        const Deaths = player.stats.duels.classic.deaths;
        const Wins = player.stats.duels.classic.wins;
        const Losses = player.stats.duels.classic.losses;
        const KDR = player.stats.duels.classic.KDRatio;
        const WLR = player.stats.duels.classic.WLRatio;
        const playedGames = player.stats.duels.classic.playedGames;
        const Winstreak = player.stats.duels.classic.winstreak;
        const bestWinstreak = player.stats.duels.classic.bestWinstreak;
        const Division = player.stats.duels.classic.division;
        const classic = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Classic Duels Statistics`)
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
        interaction.reply({ embeds: [classic] });
        con.query(
          `INSERT INTO Duels (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,playedGames,Winstreak,bestWinstreak,Division) VALUES ('Classic','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${playedGames}','${Winstreak}','${bestWinstreak}','${Division}')`
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
