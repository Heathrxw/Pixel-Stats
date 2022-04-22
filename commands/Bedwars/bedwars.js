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
    .setName("bedwars")
    .setDescription("Gets specified players stats for Bedwars statistics")
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
        const level = player.stats.bedwars.level;
        const prestige = player.stats.bedwars.prestige;
        const coins = player.stats.bedwars.coins;
        const kills = player.stats.bedwars.kills;
        const deaths = player.stats.bedwars.deaths;
        const wins = player.stats.bedwars.wins;
        const losses = player.stats.bedwars.losses;
        const kdr = player.stats.bedwars.KDRatio;
        const wlr = player.stats.bedwars.WLRatio;
        const winstreak = player.stats.bedwars.winstreak;
        const playedGames = player.stats.bedwars.playedGames;
        const finalKills = player.stats.bedwars.finalKills;
        const finalDeaths = player.stats.bedwars.finalDeaths;
        const finalKDRatio = player.stats.bedwars.finalKDRatio;
        const BedsLost = player.stats.bedwars.beds.lost;
        const BedsBroke = player.stats.bedwars.beds.broken;
        const BedsRatio = player.stats.bedwars.beds.BLRatio;
        const AvgFinals = player.stats.bedwars.avg.finalKills;
        const AvgBeds = player.stats.bedwars.avg.bedsBroken;
        const AvgKills = player.stats.bedwars.avg.kills;
        const bw = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Bedwars Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png"
          )
          .addField("Level", commaNumber(level), true)
          .addField("Prestige", commaNumber(prestige), true)
          .addField("Coins", commaNumber(coins), true)
          .addField("Kills", commaNumber(kills), true)
          .addField("Deaths", commaNumber(deaths), true)
          .addField("Wins", commaNumber(wins), true)
          .addField("Losses", commaNumber(losses), true)
          .addField("KDR", commaNumber(kdr), true)
          .addField("WLR", commaNumber(wlr), true)
          .addField("Winstreak", commaNumber(winstreak), true)
          .addField("Games Played", commaNumber(playedGames), true)
          .addField("Average Beds Broken", commaNumber(AvgBeds), true)
          .addField("Average Final Kills", commaNumber(AvgFinals), true)
          .addField("Average Kills", commaNumber(AvgKills), true)
          .addField("Beds Broken", commaNumber(BedsBroke), true)
          .addField("Beds Lost", commaNumber(BedsLost), true)
          .addField("Beds Ratio", commaNumber(BedsRatio), true)
          .addField("Final Kills", commaNumber(finalKills), true)
          .addField("Final Deaths", commaNumber(finalDeaths), true)
          .addField("Final KDR", commaNumber(finalKDRatio), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [bw] });
        con.query(
          `INSERT INTO Bedwars (Mode,Username,Level,Prestige,Coins,Kills,Deaths,Wins,Losses,KDR,WLR,playedGames,AvgBedsBroke,AvgFinalKills,AvgKills,BedsBroke,BedsLost,BedsRatio,FinalKills,FinalDeaths,FinalKDRatio) VALUES ('Bedwars','${username}','${level}','${prestige}','${coins}','${kills}','${deaths}','${wins}','${losses}','${kdr}','${wlr}','${playedGames}','${AvgBeds}','${AvgFinals}','${AvgKills}','${BedsBroke}','${BedsLost}','${BedsRatio}','${finalKills}','${finalDeaths}','${finalKDRatio}')`
        );
      })
      .catch((err) => {
        interaction.reply(`${username} is not a valid name! Are they nicked?`);
        console.log(err);
      });
  },
};
