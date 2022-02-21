const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientID, guildID, token } = require('./config.json');

const commands = [];
const commandFilesCore = fs.readdirSync('./commands/Core').filter(file => file.endsWith('.js'));
const commandFilesSkywars = fs.readdirSync('./commands/Skywars').filter(file => file.endsWith('.js'));
const commandFilesBedwars = fs.readdirSync('./commands/Bedwars').filter(file => file.endsWith('.js'));
const commandFilesDuels = fs.readdirSync('./commands/Duels').filter(file => file.endsWith('.js'));
const commandFilesClassic = fs.readdirSync('./commands/Classic').filter(file => file.endsWith('.js'));
const commandFilesExternal = fs.readdirSync('./commands/External').filter(file => file.endsWith('.js'));
const commandFilesBlitz = fs.readdirSync('./commands/Blitz').filter(file => file.endsWith('.js'));

for (var file of commandFilesCore) {
	const command = require(`./commands/Core/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesSkywars) {
	const command = require(`./commands/Skywars/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesBedwars) {
	const command = require(`./commands/Bedwars/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesDuels) {
	const command = require(`./commands/Duels/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesClassic) {
	const command = require(`./commands/Classic/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesExternal) {
	const command = require(`./commands/External/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesBlitz) {
	const command = require(`./commands/Blitz/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);