const { Routes, REST } = require('discord.js');
const { BotVariables } = require('./env.js');
const fs = require('node:fs');

class CommandDeployer {
	// Function to call to deploy commands gloablly, pass a guildID if you wish to deploy them instantly to a specific server, otherwise it takes up to hours.
	static deploySlashCommandsGlobally(guildID = '', unload = false) {
		// Load the commands into an array.
		var commands = [];
		for (const filePath of fs.readdirSync('./user_commands')) {
			// Load each command script and add its data to the commands array.
			const command = require(`./user_commands/${filePath}`);
			commands.push(command.data.toJSON());
		}

		// Return if no commands are found.
		if (commands.length <= 0) return;
		
		// Create the REST object to deploy the commands.
		const rest = new REST({ version: '10' }).setToken(BotVariables.TOKEN);

		try {
			if (guildID === '') {
				// Deploy the commands to all servers.
				if (unload === true) commands = [] // Optionally, if unload is true, empty the commands array to unload commands.

				// Deploy the commands globally for the application.
				rest.put(Routes.applicationCommands(BotVariables.APPLICATION_ID), { body: commands });
			} else {
				// Deploy the commands to a specific server.
				if (unload === true) commands = [] // Optionally, if unload is true, empty the commands array to unload commands.

				// Deploy the commands to a specific server (guild).
				rest.put(Routes.applicationGuildCommands(BotVariables.APPLICATION_ID, guildID), { body: commands });
			}
			console.log(`Reloaded ${commands.length} slash commands successfully!`);
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = { CommandDeployer };