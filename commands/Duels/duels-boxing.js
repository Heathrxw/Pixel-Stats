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
    .setName("duels-boxing")
    .setDescription("Gets specified players stats for Boxing duels statistics")
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
        const Division = player.stats.duels.boxing.division;
        const Kills = player.stats.duels.boxing.kills;
        const Wins = player.stats.duels.boxing.wins;
        const Losses = player.stats.duels.boxing.losses;
        const WLR = player.stats.duels.boxing.WLRatio;
        const playedGames = player.stats.duels.boxing.playedGames;
        const MeleeSwings = player.stats.duels.boxing.meleeSwings;
        const MeleeHits = player.stats.duels.boxing.meleeHits;
        const boxing = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Boxing Duels Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Losses", commaNumber(Losses), true)
          .addField("WLR", commaNumber(WLR), true)
          .addField("Played Games", commaNumber(playedGames), true)
          .addField("Division", commaNumber(Division), true)
          .addField("Melee Swings", commaNumber(MeleeSwings), true)
          .addField("Melee Hits", commaNumber(MeleeHits), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [boxing] });
        con.query(
          `INSERT INTO Duels (Mode,Username,Kills,Wins,Losses,WLR,playedGames,Division,MeleeSwings,MeleeHits) VALUES ('Boxing','${username}','${Kills}','${Wins}','${Losses}','${WLR}','${playedGames}','${Division}','${MeleeSwings}','${MeleeHits}')`
        );
      })
      .catch((err) => {
        interaction.reply(`${username} is not a valid name! Are they nicked?`);
        console.log(err);
      });
  },
};
