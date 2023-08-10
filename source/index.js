const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { DataManager } = require('./libs/manager.js');
const { CommandDeployer } = require('./deploy_commands.js');
const { BotVariables } = require('./env.js');
const fs = require('node:fs');

// Create the bot client with specific intents.
const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds] });
client.commands = new Collection();
client._listeners = new Collection();

module.exports = client;

// Iterate the folder with command scripts, and set them as the callback for the discord slash commands.
for (const filePath of fs.readdirSync('./user_commands')) {
	// Load the command script.
	const command = require(`./user_commands/${filePath}`);
	// Set the command as a callback for the corresponding discord slash command name.
	client.commands.set(command.data.name, command);
}

// Iterate the folder with listener scripts, and set them as the callback for the voice state update event.
for (const filePath of fs.readdirSync('./listeners')) {
	// Load the listener script.
	const listener = require(`./listeners/${filePath}`);
	// Set the listener as a callback for the corresponding event name.
	client.commands.set(listener.name, listener);
}

// Function that is called once the bot has started up.
client.once('ready', () => {
	// Log bot's user tag upon successful login.
	console.log(`--- { Logged in as: ${client.user.tag} } ---`);
	// Log the author's name or contact info.
	console.log(`--- { Made by: Luka Ric Hansen Jacobsen } ---`);
});

// Function that handles the callback from a slash command.
client.on('interactionCreate', async (interaction) => {
	// Check if the received interaction is a command.
	if (!interaction.isCommand()) return;

	// Log the command execution.
	const optionValues = interaction.options._hoistedOptions.map((option) => option.value).join(' ');
	console.log(`[Command Executed]  ${interaction.user.username} => /${interaction.commandName} ${optionValues}`);

	// Execute the command.
	const command = interaction.client.commands.get(interaction.commandName);
	command.execute(interaction);
});

// Function that handles the event of the voice state update.
const listener = require('./listeners/vc_listener.js');
client.on('voiceStateUpdate', async (oldState, newState) => {
	// If there is no data, or missing data, return
	const data = DataManager.getData(oldState.guild.id);
	if (data['confirmation_channel'] === '' || data['temp_channels_category'] === '', data['channel_listeners'] === {}) return;

	// Execute the voice state update listener.
	listener.execute(oldState, newState);
})

// Specify Guild ID (str) to deploy instantly to that server, else deploys to all servers.
//CommandDeployer.deploySlashCommandsGlobally('1073670864832299128', true);

// Ready, set, launch!
try {
	client.login(BotVariables.TOKEN);
} catch (error) {
	console.error('Error during bot login:', error);
}