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
    .setName("galaxy-wars")
    .setDescription("Gets specified players Galaxy Wars statistics")
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
        const Kills = player.stats.arcade.galaxyWars.kills;
        const Deaths = player.stats.arcade.galaxyWars.deaths;
        const Wins = player.stats.arcade.galaxyWars.wins;
        const ShotFire = player.stats.arcade.galaxyWars.shotsFired;
        const WeeklyKills = player.stats.arcade.galaxyWars.weeklyKills;
        const MonthKills = player.stats.arcade.galaxyWars.monthlyKills;
        const AttackKills = player.stats.arcade.galaxyWars.attackerKills;
        const DefKills = player.stats.arcade.galaxyWars.defenderKills;
        const Galaxy = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Galaxy Wars Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/Arcade-64.png"
          )
          .addField("Kills", commaNumber(Kills), true)
          .addField("Deaths", commaNumber(Deaths), true)
          .addField("Wins", commaNumber(Wins), true)
          .addField("Shots Fired", commaNumber(ShotFire), true)
          .addField("Weekly Kills", commaNumber(WeeklyKills), true)
          .addField("Monthly Kills", commaNumber(MonthKills), true)
          .addField("Attacker Kills", commaNumber(AttackKills), true)
          .addField("Defender Kills", commaNumber(DefKills), true)
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [Galaxy] });
        con.query(
          `INSERT INTO GalaxyWars (Mode,Username,Kills,Deaths,Wins,ShotsFired,WeeklyKills,MonthlyKills,AttackerKills,DefenderKills) VALUES ('GalaxyWars','${username}','${Kills}','${Deaths}','${Wins}','${ShotFire}','${WeeklyKills}','${MonthKills}','${AttackKills}','${DefKills}')`
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
