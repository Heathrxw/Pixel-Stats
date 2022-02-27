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
    .setName("blitz")
    .setDescription("Gets specified players Blitz SG statistics")
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
        const Kills = player.stats.blitzsg.kills;
        const Deaths = player.stats.blitzsg.deaths;
        const KDR = player.stats.blitzsg.KDRatio;
        const SoloWins = player.stats.blitzsg.winsSolo;
        const TeamWins = player.stats.blitzsg.winsTeam;
        const Coins = player.stats.blitzsg.coins;
        const blitzsg = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Blitz SG Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/SG-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("Solo Wins", commaNumber(SoloWins), true)
          .addField("Team Wins", commaNumber(TeamWins), true)
          .addField("Coins", commaNumber(Coins), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [blitzsg] });
        con.query(
          `INSERT INTO Blitz (Mode,Username,Kills,Deaths,KDR,SoloWins,TeamWins,Coins) VALUES ('Blitz','${username}','${Kills}','${Deaths}','${KDR}','${SoloWins}','${TeamWins}','${Coins}')`
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
