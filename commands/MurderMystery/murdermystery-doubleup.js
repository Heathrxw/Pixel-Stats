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
    .setName("murder-mystery-doubleup")
    .setDescription("Gets specified players stats for Murder Mystery Double Up statistics")
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
        const Kills = (player.stats.murdermystery.doubleUp.kills);
        const Deaths = (player.stats.murdermystery.doubleUp.deaths);
        const Wins = (player.stats.murdermystery.doubleUp.wins);
        const KDR = (player.stats.murdermystery.doubleUp.KDRatio);
        const PlayedGames = (player.stats.murdermystery.doubleUp.playedGames);
        const doubleUp = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Murder Mystery Double Up Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/MurderMystery-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("Played Games", commaNumber(PlayedGames), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [doubleUp] });
        con.query(
          `INSERT INTO MurderMystery (Mode,Username,Kills,Deaths,Wins,KDR,playedGames) VALUES ('DoubleUp','${username}','${Kills}','${Deaths}','${Wins}','${KDR}','${PlayedGames}')`
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
