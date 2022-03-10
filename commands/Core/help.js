const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton } = require("discord.js");
const { color } = require("../../config.json");
const paginationEmbed = require("discordjs-button-pagination");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays Help Menu"),

  execute(interaction) {
    const page1 = new MessageEmbed()
      .setColor(color)
      .setTitle("Stats Pixel Help Menu")
      .setThumbnail("https://i.heathrxw.xyz/hypixel.png")
      .addField(
        "Welcome to the Stats Pixel Help Menu!",
        "You can use the buttons below to cycle through the pages for the different commands!"
      )
      .addField(
        "Commands",
        "Most games are included if not, please go to the link in the footer!"
      )
      .addField(
        "Valid Modes",
        "The valid games so far are: Skywars, Duels, Arcade, BedWars, Blitz, Build Battle, Classic, SpeedUHC, Warlords and Walls"
      )
      .setFooter({
        text: "Stats Pixel Help Menu, For more info visit https://pixel-stats.heathrxw.xyz",
      });

    let page2 = new MessageEmbed()
      .setColor(color)
      .setTitle("Stats Pixel Commands")
      .setThumbnail("https://i.heathrxw.xyz/hypixel.png")
      .addField(
        "Arcade",
        "/zombies, /football, /mini-walls, /hole-in-the-wall, /galaxy-wars"
      )
      .addField(
        "Bedwars",
        "/bedwars, /bedwars-solo, /bedwars-doubles, /bedwars-threes, /bedwars-fours, /bedwars-ultimate-doubles, /bedwars-ultimate-fours, /bedwars-rush-doubles, /bedewars-rush-fours, /bedwars-armed-doubles, /bedwars-armed-fours"
      )
      .addField("Blitz", "/blitz")
      .addField("Build Battle", "/build-battle")
      .addField(
        "Classic",
        "/arena-brawl-solo, /arena-brawl-doubles, /arena-brawl-fours, /turbo-kart-racers, /turbo-kart-racers-maps, /vampirez, /walls"
      )
      .addField("Duels", "/duels, /duels-[mode]")
      .addField("Skywars", "/skywars, /skywars-[mode]")
      .addField("Speed UHC", "/speed-uhc")
      .addField("Warlords", "/warlords")
      .setFooter({
        text: "Stats Pixel Help Menu, For more info visit https://pixel-stats.heathrxw.xyz",
      });

    let page3 = new MessageEmbed()
      .setColor(color)
      .setTitle("Stats Pixel Changelog")
      .setThumbnail("https://i.heathrxw.xyz/hypixel.png")
      .addField("Version", "0.7.8")
      .addField(
        "Changes",
        "Formatted a lot of commands, Added cops n crims, updated help file, added dreams mode to bedwars, added megawalls"
      );

    let page4 = new MessageEmbed()
      .setColor(color)
      .setTitle("Stats Pixel Status")
      .setThumbnail("https://i.heathrxw.xyz/hypixel.png")
      .addField(
        "Status",
        "You can view the public status of the bot here, including downtime, uptime and database issues"
      )
      .setDescription("https://status.heathrxw.xyz")
      .setFooter({
        text: "Stats Pixel Help Menu, For more info visit https://pixel-stats.heathrxw.xyz",
      });

    const button1 = new MessageButton()
      .setCustomId("previousbtn")
      .setLabel("Previous")
      .setStyle("DANGER");

    const button2 = new MessageButton()
      .setCustomId("nextbtn")
      .setLabel("Next")
      .setStyle("SUCCESS");

    pages = [page1, page2, page3, page4];
    const timeout = 60000;
    buttonList = [button1, button2];

    paginationEmbed(interaction, pages, buttonList, timeout);
  },
};
