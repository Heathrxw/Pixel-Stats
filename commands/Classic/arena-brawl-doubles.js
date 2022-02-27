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
    .setName("arena-brawl-doubles")
    .setDescription("Gets specified players Arena Brawl 2v2 statistics")
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
        const Kills = player.stats.arena.mode.doubles.kills;
        const Deaths = player.stats.arena.mode.doubles.deaths;
        const Wins = player.stats.arena.mode.doubles.wins;
        const Losses = player.stats.arena.mode.doubles.losses;
        const KDR = player.stats.arena.mode.doubles.KDRatio;
        const WLR = player.stats.arena.mode.doubles.WLRatio;
        const Coins = player.stats.arena.coins;
        const arenadoubles = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Arena Brawl 2v2 Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Arena-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Coins", commaNumber(Coins), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [arenadoubles] });
        con.query(
          `INSERT INTO ArenaBrawl (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,Coins) VALUES ('Doubles','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${Coins}')`
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
