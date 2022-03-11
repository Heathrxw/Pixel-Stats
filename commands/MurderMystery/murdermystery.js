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
    .setName("murder-mystery")
    .setDescription("Gets specified players stats for Murder Mystery statistics")
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
        const Kills = (player.stats.murdermystery.kills);
        const Deaths = (player.stats.murdermystery.deaths);
        const Wins = (player.stats.murdermystery.wins);
        const MurdererWins = (player.stats.murdermystery.winsAsMurderer);
        const DetectiveWins = (player.stats.murdermystery.winsAsDetective);
        const Coins = (player.stats.murdermystery.coins);
        const PlayedGames = (player.stats.murdermystery.playedGames);
        const murdermystery = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Murder Mystery Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/MurderMystery-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Murderer Wins", commaNumber(MurdererWins), true)
          .addField("Detective Wins", commaNumber(DetectiveWins), true)
          .addField("Coins", commaNumber(Coins), true)
          .addField("Played Games", commaNumber(PlayedGames), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [murdermystery] });
        con.query(
          `INSERT INTO MurderMystery (Mode,Username,Kills,Deaths,Wins,Losses,KDR,WLR) VALUES ('MurderMystery','${username}','${Kills}','${Deaths}','${Wins}','${Losses}','${KDR}','${WLR}')`
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
