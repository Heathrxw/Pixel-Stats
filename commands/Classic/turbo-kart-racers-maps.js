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
    .setName("turbo-kart-racers-maps")
    .setDescription("Gets specified players Turbo Kart Racers Maps statistics")
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
        const grandPrixTokens = player.stats.turbokartracers.grandPrixTokens;
        const retroPlays = player.stats.turbokartracers.retroPlays;
        const hypixelgpPlays = player.stats.turbokartracers.hypixelgpPlays;
        const olympusPlays = player.stats.turbokartracers.olympusPlays;
        const junglerushPlays = player.stats.turbokartracers.junglerushPlays;
        const canyonPlays = player.stats.turbokartracers.canyonPlays;
        const retroBronzeTrophies =
          player.stats.turbokartracers.retroBronzeTrophies;
        const retroSilverTrophies =
          player.stats.turbokartracers.retroSilverTrophies;
        const retroGoldTrophies =
          player.stats.turbokartracers.retroGoldTrophies;
        const hypixelgpBronzeTrophies =
          player.stats.turbokartracers.hypixelgpBronzeTrophies;
        const hypixelgpSilverTrophies =
          player.stats.turbokartracers.hypixelgpSilverTrophies;
        const hypixelgpGoldTrophies =
          player.stats.turbokartracers.hypixelgpGoldTrophies;
        const olympusBronzeTrophies =
          player.stats.turbokartracers.olympusBronzeTrophies;
        const olympusSilverTrophies =
          player.stats.turbokartracers.olympusSilverTrophies;
        const olympusGoldTrophies =
          player.stats.turbokartracers.olympusGoldTrophies;
        const junglerushBronzeTrophies =
          player.stats.turbokartracers.junglerushBronzeTrophies;
        const junglerushSilverTrophies =
          player.stats.turbokartracers.junglerushSilverTrophies;
        const junglerushGoldTrophies =
          player.stats.turbokartracers.junglerushGoldTrophies;
        const canyonBronzeTrophies =
          player.stats.turbokartracers.canyonBronzeTrophies;
        const canyonSilverTrophies =
          player.stats.turbokartracers.canyonSilverTrophies;
        const canyonGoldTrophies =
          player.stats.turbokartracers.canyonGoldTrophies;
        const tkrmaps = new MessageEmbed()
          .setColor(color)
          .setTitle(`${player}'s Turbo Kart Racers Maps Statistics`)
          .setThumbnail(
            "https://hypixel.net/styles/hypixel-v2/images/game-icons/TurboKartRacers-64.png"
          )
          .addField("Grand Prix Tokens", commaNumber(grandPrixTokens), true)
          .addField("Retro Plays", commaNumber(retroPlays), true)
          .addField("Hypixel GP Plays", commaNumber(hypixelgpPlays), true)
          .addField("Olympus Plays", commaNumber(olympusPlays), true)
          .addField("Jungle Rush Plays", commaNumber(junglerushPlays), true)
          .addField("Canyon Plays", commaNumber(canyonPlays), true)
          .addField(
            "Retro Bronze Trophies",
            commaNumber(retroBronzeTrophies),
            true
          )
          .addField(
            "Retro Silver Trophies",
            commaNumber(retroSilverTrophies),
            true
          )
          .addField(
            "Retro Bronze Trophies",
            commaNumber(retroGoldTrophies),
            true
          )
          .addField(
            "Hypixel GP Bronze Trophies",
            commaNumber(hypixelgpBronzeTrophies),
            true
          )
          .addField(
            "Hypixel GP Silver Trophies",
            commaNumber(hypixelgpSilverTrophies),
            true
          )
          .addField(
            "Hypixel GP Gold Trophies",
            commaNumber(hypixelgpGoldTrophies),
            true
          )
          .addField(
            "Olympus Bronze Trophies",
            commaNumber(olympusBronzeTrophies),
            true
          )
          .addField(
            "Olympus Silver Trophies",
            commaNumber(olympusSilverTrophies),
            true
          )
          .addField(
            "Olympus Gold Trophies",
            commaNumber(olympusGoldTrophies),
            true
          )
          .addField(
            "Jungle Rush Bronze Trophies",
            commaNumber(junglerushBronzeTrophies),
            true
          )
          .addField(
            "Jungle Rush Silver Trophies",
            commaNumber(junglerushSilverTrophies),
            true
          )
          .addField(
            "Jungle Rush Gold Trophies",
            commaNumber(junglerushGoldTrophies),
            true
          )
          .addField(
            "Canyon Bronze Trophies",
            commaNumber(canyonBronzeTrophies),
            true
          )
          .addField(
            "Canyon Silver Trophies",
            commaNumber(canyonSilverTrophies),
            true
          )
          .addField(
            "Canyon Gold Trophies",
            commaNumber(canyonGoldTrophies),
            true
          )
          .setTimestamp()
          .setFooter({
            text: footer,
            iconURL: `https://visage.surgeplay.com/face/256/${playerUUIDData.id}.png`,
          });
        interaction.reply({ embeds: [tkrmaps] });
        con.query(
          `INSERT INTO TurboKartRacers (Mode,Username,retroPlays,hypixelgpPlays,olympusPlays,junglerushPlays,canyonPlays,retroBronzeTrophies,retroSilverTrophies,retroGoldTrophies,hypixelgpBronzeTrophies,hypixelgpSilverTrophies,hypixelgpGoldTrophies,olympusBronzeTrophies,olympusSilverTrophies,olympusGoldTrophies,junglerushBronzeTrophies,junglerushSilverTrophies,junglerushGoldTrophies,canyonBronzeTrophies,canyonSilverTrophies,canyonGoldTrophies,grandPrixTokens) VALUES ('TKR','${username}','${retroPlays}','${hypixelgpPlays}','${olympusPlays}','${junglerushPlays}','${canyonPlays}','${retroBronzeTrophies}','${retroSilverTrophies}','${retroGoldTrophies}','${hypixelgpBronzeTrophies}','${hypixelgpSilverTrophies}','${hypixelgpGoldTrophies}','${olympusBronzeTrophies}','${olympusSilverTrophies}','${olympusGoldTrophies}','${junglerushBronzeTrophies}','${junglerushSilverTrophies}','${junglerushGoldTrophies}','${canyonBronzeTrophies}','${canyonSilverTrophies}','${canyonGoldTrophies}','${grandPrixTokens}')`
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
