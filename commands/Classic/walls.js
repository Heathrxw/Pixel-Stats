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
    .setName("walls")
    .setDescription("Gets specified players Walls statistics")
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
        const Kills = player.stats.walls.kills;
        const Deaths = player.stats.walls.deaths;
        const Wins = player.stats.walls.wins;
        const Losses = player.stats.walls.losses;
        const KDR = player.stats.walls.KDRatio;
        const WLR = player.stats.walls.WLRatio;
        const Coins = player.stats.walls.coins;
        const Assists = player.stats.walls.assists;
        const wallsEmbed = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Walls Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Walls-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Assists", commaNumber(Assists), true)
          .addField("Total Coins", commaNumber(Coins), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [wallsEmbed] });
        con.query(
          `INSERT INTO Walls (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,Coins,Assists) VALUES ('Walls','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${Coins}','${Assists}')`
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
