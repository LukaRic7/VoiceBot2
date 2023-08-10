### --- { OVERVIEW } --- ###
This documentation is mostly for future programmers editing this program. Comments will be found in all scripts describing what they do.

### --- { FILE DESCRIPTIONS } --- ###
# index.js
This is the main entry point of the bot. It sets up the Discord.js client and registers event listeners for command execution and voice state updates.

# env.js
The `env.js` file contains the necessary environment variables used in the bot, such as the bot token and application ID. Make sure to provide the correct values for these variables before running the bot.

# deploy_commands.js
The `deploy_commands.js` file contains the `CommandDeployer` class responsible for deploying the slash commands to Discord servers. It uses the Discord.js REST API to register the bot's slash commands globally or in a specific server.

# libs/manager.js
The `manager.js` file contains the `DataManager` class responsible for reading and writing data to a JSON file. It stores guild-specific settings related to voice channels, such as the monitored channel, category for new channels, and the desired number of members to create a new channel.

# user_commands/
This folder contains individual command scripts, each representing a slash command the bot can execute. Each command is a standalone module exporting an object that defines the command's data and an `execute` function that handles the command execution.

# listeners/
This folder contains individual listener scripts, each representing an event listener for voice state updates. The `vc_listener.js` file exports an object that defines the listener's `name` and an `execute` function that handles user join and leave events to manage temporary voice channels.

# database/monitors.json
This JSON file serves as a simple database to store guild-specific settings. It contains a map of guild IDs as keys, and each guild ID maps to an object containing the monitored channel ID, category ID, and the desired number of members for temporary voice channel creation.