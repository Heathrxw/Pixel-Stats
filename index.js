//Import modules
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const config = require('./config.json')
const { createConnection } = require('mysql2')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
//Read Commands

client.commands = new Collection();
const commandFilesCore = fs.readdirSync('./commands/Core').filter(file => file.endsWith('.js'));
const commandFilesSkywars = fs.readdirSync('./commands/Skywars').filter(file => file.endsWith('.js'));
const commandFilesBedwars = fs.readdirSync('./commands/Bedwars').filter(file => file.endsWith('.js'));
const commandFilesDuels = fs.readdirSync('./commands/Duels').filter(file => file.endsWith('.js'));
const commandFilesClassic = fs.readdirSync('./commands/Classic').filter(file => file.endsWith('.js'));
const commandFilesExternal = fs.readdirSync('./commands/External').filter(file => file.endsWith('.js'));
const commandFilesBlitz = fs.readdirSync('./commands/Blitz').filter(file => file.endsWith('.js'));
const commandFilesSpeedUHC = fs.readdirSync('./commands/SpeedUHC').filter(file => file.endsWith('.js'));
const commandFilesWarlords = fs.readdirSync('./commands/Warlords').filter(file => file.endsWith('.js'));
const commandFilesArcade = fs.readdirSync('./commands/Arcade').filter(file => file.endsWith('.js'));

for (var file of commandFilesCore) {
	const command = require(`./commands/Core/${file}`);
	client.commands.set(command.data.name, command);
}

for (var file of commandFilesSkywars) {
	const command1 = require(`./commands/Skywars/${file}`);
	client.commands.set(command1.data.name, command1);
}

for (var file of commandFilesBedwars) {
	const command2 = require(`./commands/Bedwars/${file}`);
	client.commands.set(command2.data.name, command2);
}

for (var file of commandFilesDuels) {
	const command3 = require(`./commands/Duels/${file}`);
	client.commands.set(command3.data.name, command3);
}

for (var file of commandFilesClassic) {
	const command4 = require(`./commands/Classic/${file}`);
	client.commands.set(command4.data.name, command4);
}

for (var file of commandFilesExternal) {
	const command5 = require(`./commands/External/${file}`);
	client.commands.set(command5.data.name, command5);
}

for (var file of commandFilesBlitz) {
	const command6 = require(`./commands/Blitz/${file}`);
	client.commands.set(command6.data.name, command6);
}

for (var file of commandFilesSpeedUHC) {
	const command7 = require(`./commands/SpeedUHC/${file}`);
	client.commands.set(command7.data.name, command7);
}

for (var file of commandFilesWarlords) {
	const command8 = require(`./commands/Warlords/${file}`);
	client.commands.set(command8.data.name, command8);
}

for (var file of commandFilesArcade) {
	const command9 = require(`./commands/Arcade/${file}`);
	client.commands.set(command9.data.name, command9);
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
console.log("Connecting to database...");
let con = createConnection(config.mysql);
con.connect(err => {
    if(err)return console.log('Connection to the database has been lost!' + err);
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