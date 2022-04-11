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
    .setName("tnt-tag")
    .setDescription("Gets specified players TNT Tag statistics")
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
        const Kills = player.stats.tntgames.tnttag.kills;
        const Wins = player.stats.tntgames.tnttag.wins;
        const tnttag = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s TNT Tag Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/TNT-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Wins", commaNumber(Wins), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [tnttag] });
        con.query(
          `INSERT INTO TNTGames (Mode,Username,Kills,Wins,Speed) VALUES ('TNTTag','${username}','${Kills}','${Wins}','${Speed}')`
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
