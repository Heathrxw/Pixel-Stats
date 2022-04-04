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
const commandFilesSpeedUHC = fs.readdirSync('./commands/SpeedUHC').filter(file => file.endsWith('.js'));
const commandFilesWarlords = fs.readdirSync('./commands/Warlords').filter(file => file.endsWith('.js'));
const commandFilesArcade = fs.readdirSync('./commands/Arcade').filter(file => file.endsWith('.js'));
const commandFilesBuildBattle = fs.readdirSync('./commands/BuildBattle').filter(file => file.endsWith('.js'));
const commandFilesMegaWalls = fs.readdirSync('./commands/MegaWalls').filter(file => file.endsWith('.js'));
const commandFilesCVC = fs.readdirSync('./commands/CVC').filter(file => file.endsWith('.js'));
const commandFilesMurderMystery = fs.readdirSync('./commands/MurderMystery').filter(file => file.endsWith('.js'));
const commandFilesUHC = fs.readdirSync('./commands/UHC').filter(file => file.endsWith('.js'));


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

for (var file of commandFilesSpeedUHC) {
	const command = require(`./commands/SpeedUHC/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesWarlords) {
	const command = require(`./commands/Warlords/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesArcade) {
	const command = require(`./commands/Arcade/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesBuildBattle) {
	const command = require(`./commands/BuildBattle/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesMegaWalls) {
	const command = require(`./commands/MegaWalls/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesCVC) {
	const command = require(`./commands/CVC/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesMurderMystery) {
	const command = require(`./commands/MurderMystery/${file}`);
	commands.push(command.data.toJSON());
}

for (var file of commandFilesUHC) {
	const command = require(`./commands/UHC/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
