const fs = require('node:fs');

class DataManager {
	// Verify if the guild has a datastore.
	static verifyGuild(guildID) {
		try {
			// Read the content of the JSON file into a variable.
			const data = JSON.parse(fs.readFileSync('./database/monitors.json', 'utf8'));
			
			// Check if the data exists and if the guildID is not present in the data.
			if (data && !data.hasOwnProperty(guildID)) {
				// If the guildID is not present, create a new data entry with default values.
				data[guildID] = {'channel_listeners': {}, 'confirmation_channel': '', 'temp_channels_category': ''};
				
				// Write the updated data back to the JSON file.
				try {
					fs.writeFileSync('./database/monitors.json', JSON.stringify(data, null), 'utf8');
				} catch (error) {
					console.error('Error writing JSON file:', error.message);
				}
			}
		} catch (error) {
			console.error('Error reading JSON file:', error.message);
		}
	}

	// Get the guild's datastore.
	static getData(guildID) {
		// Verify the guild's datastore to ensure it exists.
		this.verifyGuild(guildID);

		// Read the content of the JSON file into a variable.
		const data = JSON.parse(fs.readFileSync('./database/monitors.json', 'utf8'));
		
		// Return the data associated with the guildID.
		return data[guildID];
	}

	// Set the guilds's datastore.
	static setData(guildID, newData) {
		// Verify the guild's datastore to ensure it exists.
		this.verifyGuild(guildID);

		// Read the content of the JSON file into a variable.
		const data = JSON.parse(fs.readFileSync('./database/monitors.json', 'utf8'));
		
		try {
			// Update the data associated with the guildID.
			data[guildID] = newData;
			
			// Write the updated data back to the JSON file.
			fs.writeFileSync('./database/monitors.json', JSON.stringify(data, null), 'utf8');
		} catch (error) {
			console.error('Error writing JSON file:', error.message);
		}
	}
}

module.exports = { DataManager };