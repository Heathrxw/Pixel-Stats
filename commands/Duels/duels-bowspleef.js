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
    .setName("duels-bow-spleef")
    .setDescription(
      "Gets specified players stats for Bow Spleef duels statistics"
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
        const Deaths = player.stats.duels.bowspleef.deaths;
        const Wins = player.stats.duels.bowspleef.wins;
        const Losses = player.stats.duels.bowspleef.losses;
        const WLR = player.stats.duels.bowspleef.WLRatio;
        const playedGames = player.stats.duels.bowspleef.playedGames;
        const Winstreak = player.stats.duels.bowspleef.winstreak;
        const bestWinstreak = player.stats.duels.bowspleef.bestWinstreak;
        const Division = player.stats.duels.bowspleef.division;
        const bowspleef = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Bow Spleef Duels Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png"
          )
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
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
        interaction.reply({ embeds: [bowspleef] });
        con.query(
          `INSERT INTO Duels (Mode,Username,Deaths,Wins,Losses,WLR,playedGames,Winstreak,bestWinstreak,Division) VALUES ('BowSpleef','${username}','${Deaths}','${Wins}','${Losses}','${WLR}','${playedGames}','${Winstreak}','${bestWinstreak}','${Division}')`
        );
      })
      .catch((err) => {
        interaction.reply(`${username} is not a valid name! Are they nicked?`);
        console.log(err);
      });
  },
};
