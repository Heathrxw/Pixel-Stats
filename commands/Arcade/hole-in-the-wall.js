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
    .setName("hole-in-the-wall")
    .setDescription("Gets specified players Hole in The Wall statistics")
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
        const RecordFinals =
          player.stats.arcade.holeInTheWall.scoreRecordFinals;
        const RecordNormal =
          player.stats.arcade.holeInTheWall.scoreRecordNormal;
        const RecordOverall =
          player.stats.arcade.holeInTheWall.scoreRecordOverall;
        const HITW = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Hole in The Wall Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Arcade-64.png"
          )
          .addField("Record Finals", commaNumber(RecordFinals), true)
          .addField("Record Normal", commaNumber(RecordNormal), true)
          .addField("Record Overall", commaNumber(RecordOverall), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [HITW] });
        con.query(
          `INSERT INTO HITW (Mode,Username,RecordFinals,RecordNormal,RecordOverall) VALUES ('HITW','${username}','${RecordFinals}','${RecordNormal}','${RecordOverall}')`
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
