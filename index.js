//Import modules
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const config = require('./config.json')
const { createConnection } = require('mysql')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//Read Commands

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//Bot Online

client.once('ready', () => {
	console.log('Pixel Stats is now online!');
	client.user.setActivity(`Hypixel Stats Bot, /help`);
});
client.on('interactionCreate', interaction => {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction!`);
});

//Connect to MySQL database for user stats logging

let con = createConnection(config.mysql);
con.connect(err => {
    if(err)return console.log('Connection to the database has been lost!' + err);
    console.log("Connecting to database...");
    console.log("Connected to database!");
})

//Notifier for guild join

client.on("guildCreate", guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
})

//Notifer for guild leave

client.on("guildDelete", guild => {
	console.log(`Removed from guild: ${guild.name} (id: ${guild.id})`);
  });

//Creates slash commands

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Logs in with bot token

client.login(token);