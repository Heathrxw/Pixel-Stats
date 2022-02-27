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
    .setName("warlords")
    .setDescription("Gets specified players Warlords statistics")
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
        const Kills = player.stats.warlords.kills;
        const Deaths = player.stats.warlords.deaths;
        const Wins = player.stats.warlords.wins;
        const Losses = player.stats.warlords.losses;
        const KDR = player.stats.warlords.KDRatio;
        const WLR = player.stats.warlords.WLRatio;
        const Winstreak = player.stats.warlords.winstreak;
        const Class = player.stats.warlords.class;
        const Assists = player.stats.warlords.assists;
        const Coins = player.stats.warlords.coins;
        const warlords = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Warlords Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Warlords-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Assists", commaNumber(Assists), true)
          .addField("Winstreak", commaNumber(Winstreak), true)
          .addField("Class", commaNumber(Class), true)
          .addField("Coins", commaNumber(Coins), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [warlords] });
        con.query(
          `INSERT INTO Warlords (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR,Winstreak,Assists,Coins,Class) VALUES ('Warlords','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}','${Winstreak}','${Assists}','${Coins}','${Class}')`
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
