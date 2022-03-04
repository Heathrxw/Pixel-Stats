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
    .setName("megawalls")
    .setDescription("Gets specified players stats for Mega Walls statistics")
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
        const Kills = player.stats.megawalls.kills;
        const Deaths = player.stats.megawalls.deaths;
        const Wins = player.stats.megawalls.wins;
        const Losses = player.stats.megawalls.losses;
        const KDR = player.stats.megawalls.KDRatio;
        const WLR = player.stats.megawalls.WLRatio;
        const assists = player.stats.megawalls.assists;
        const finalAssists = player.stats.megawalls.finalAssists;
        const finalKills = player.stats.megawalls.finalKills;
        const finalDeaths = player.stats.megawalls.finalDeaths;
        const finalKDRatio = player.stats.megawalls.finalKDRatio;
        const coins = player.stats.megawalls.coins;
        const selectedClass = player.stats.megawalls.selectedClass;
        const playedGames = player.stats.megawalls.playedGames;
        const witherDamage = player.stats.megawalls.witherDamage;
        const defenderKills = player.stats.megawalls.defenderKills;
        const megawalls = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Overall Mega Walls Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/MegaWalls-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Assists", commaNumber(assists), true)
          .addField("Final Assists", commaNumber(finalAssists), true)
          .addField("Final Kills", commaNumber(finalKills), true)
          .addField("Final Deaths", commaNumber(finalDeaths), true)
          .addField("Final KDR", commaNumber(finalKDRatio), true)
          .addField("Coins", commaNumber(coins), true)
          .addField("Selected Class", commaNumber(selectedClass), true)
          .addField("Games Played", commaNumber(playedGames), true)
          .addField("Wither Damage", commaNumber(witherDamage), true)
          .addField("Defender Kills", commaNumber(defenderKills), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [megawalls] });
        con.query(
          `INSERT INTO MegaWalls (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,Assists,FinalAssists,FinalKills,FinalDeaths,FinalKDR,Coins,Class,playedGames,WitherDamage,DefenderKills) VALUES ('MegaWalls','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${assists}','${finalAssists}','${finalKills}','${finalDeaths}','${finalKDRatio}','${coins}','${selectedClass}','${playedGames}','${witherDamage}','${defenderKills}')`
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
