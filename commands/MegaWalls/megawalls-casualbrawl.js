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
    .setName("megawalls-casualbrawl")
    .setDescription("Gets specified players stats for Mega Walls Casual Brawl statistics")
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
        const Kills = player.stats.megawalls.mode.casualBrawl.kills;
        const Deaths = player.stats.megawalls.mode.casualBrawl.deaths;
        const Wins = player.stats.megawalls.mode.casualBrawl.wins;
        const Losses = player.stats.megawalls.mode.casualBrawl.losses;
        const KDR = player.stats.megawalls.mode.casualBrawl.KDRatio;
        const WLR = player.stats.megawalls.mode.casualBrawl.WLRatio;
        const megawallscasualBrawl = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Casual Brawl Mega Walls Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/MegaWalls-64.png"
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
        interaction.reply({ embeds: [megawallscasualBrawl] });
        con.query(
          `INSERT INTO MegaWalls (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR) VALUES ('CasualBrawl','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}')`
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
