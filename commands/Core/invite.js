const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Generates a discord invite link for the bot"),

  execute(interaction) {
    let invite = new MessageEmbed()
      .setColor(color)
      .setTitle("Stats Pixel Invite Link")
      .setThumbnail("https://i.heathrxw.xyz/dNy5Vf.png")
      .setDescription("Invite the bot to your server using the link below.")
      .addField(
        "Invite Link",
        "https://discord.com/api/oauth2/authorize?client_id=935249778994995321&permissions=414464674880&scope=bot%20applications.commands"
      )
      .setFooter({
        text: "Stats Pixel Invite Link or https://pixel-stats.heathrxw.xyz",
      });
    interaction.reply({ embeds: [invite] });
  },
};
