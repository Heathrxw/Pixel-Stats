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
    .setName("uhc-brawl")
    .setDescription("Gets specified players UHC Brawl statistics")
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
        const Kills = player.stats.uhc.brawl.kills;
        const Deaths = player.stats.uhc.brawl.deaths;
        const Wins = player.stats.uhc.brawl.wins;
        const KDR = (Kills / Deaths).toFixed(2);
        const headsEaten = player.stats.uhc.brawl.headsEaten;
        const UHCbrawl = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s UHC Brawl Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/UHC-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("KDR", commaNumber(KDR), true)
          .addField("Heads Eaten", commaNumber(headsEaten), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [UHCbrawl] });
        con.query(
          `INSERT INTO UHC (Mode,Username,Kills,Deaths,Wins,KDR,HeadsEaten) VALUES ('UHCBrawl','${username}','${Kills}','${Deaths}','${Wins}','${KDR}','${headsEaten}')`
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
