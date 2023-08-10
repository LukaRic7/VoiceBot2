const { DataManager } = require('../libs/manager.js');
const client = require('../index.js');

let tempChannelCache = [];

async function createTempChannel(data, oldState, newState) {
	// Fetch the oldState channel.
	const member = await newState.guild.members.fetch(newState.id);
	const guild = await client.guilds.fetch(newState.guild.id);
	const oldStateChannel = await client.channels.fetch(oldState.channelId);

	// Log the channel creation.
	console.log(`[Channel Created]   ${member.user.username} => ${oldStateChannel.name}`);

	// Grab the users initials.
	let initials = [...member.user.username.matchAll(new RegExp(/(\p{L}{1})\p{L}+/, 'gu'))] || [];
	initials = ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase();

	// If the desired members are null, set it to the current amount.
	let desired_members = data['channel_listeners'][oldState.channelId]['desired_members'];
	if (desired_members === null) {
		desired_members = Object.keys(oldStateChannel.members).length + 1; // Add 1 for the person initiating the channel.
	}

	// Create the channel.
	const newChannel = await guild.channels.create({
		name: `${initials}'s ${oldStateChannel.name}`,
		type: 2,
		parent: data['temp_channels_category'],
		userLimit: desired_members
	});

	// Append the new channel to the cache.
	tempChannelCache.push(newChannel);

	// Move all members from oldState channel into the new channel.
	oldStateChannel.members.forEach(async (member, index) => {
		await member.voice.setChannel(newChannel);
	});

	// Move yourself into the new channel.
	await member.voice.setChannel(newChannel);
}

module.exports = {
	name: "vc_listener",

	// Function called when the listener event is executed.
	async execute(oldState, newState) {
		// Get the data/settings associated with the guild.
		const data = DataManager.getData(newState.guild.id);

		// Check if a user joined the confirmation channel.
		if (newState.channelId === data['confirmation_channel']) {
			// Disconnect member if they wasn't previously in a channel listener.
			if (!data['channel_listeners'].hasOwnProperty(oldState.channelId)) {
				// Disconnec the member so other people can join it
				// This prevents a user from hogging the channel and just sitting there.
				const member = await newState.guild.members.fetch(newState.id);
				member.voice.disconnect();
				return;
			}

			createTempChannel(data, oldState, newState);
		}

		// Check if a user left a temp channel.
		tempChannelCache.forEach(async (channel, index) => {
			if (oldState.channelId === channel.id) {
				if (channel.members.size === 0) {
					const member = await oldState.guild.members.fetch(oldState.id);
					const oldStateChannel = await client.channels.fetch(oldState.channelId);
					
					// Log channel deletion.
					console.log(`[Channel Deleted]   ${member.user.username} => ${oldStateChannel.name}`);
					
					// Delete the channel.
					await channel.delete();
					tempChannelCache = tempChannelCache.filter((obj) => obj !== channel);
				}
			}
		})
	}
};