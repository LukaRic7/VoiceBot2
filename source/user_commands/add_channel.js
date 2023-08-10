const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DataManager } = require('../libs/manager.js');

module.exports = {
	// Build the slash command.
	data: new SlashCommandBuilder()
		.setName('add_channel')
		.setDescription('Add a channel to listen to.')
		.addChannelOption(option => option
			.setName('channel')
			.setDescription('Set the channel.')
			.setRequired(true))
		.addNumberOption(option => option
			.setName('user_limit')
			.setDescription('The max amount of members in the temp channels.')
			.setRequired(true)),

	// Function called when the command is executed.
	async execute(interaction) {
		// Check if the user is the owner.
		if (interaction.user.id !== interaction.guild.ownerId) {
			await interaction.reply({ content: 'You need to be the owner of the server to perform this action.', ephemeral: true })
			return;
		}

		// Grab the options
		const channel = interaction.options.getChannel('channel');
		const userLimit = interaction.options.getNumber('user_limit');
		const data = DataManager.getData(interaction.member.guild.id);

		// Check if the channel is a voice channel.
		if (channel.type !== 2) {
			await interaction.reply({ content: 'Specified channel is not a voice channel!', ephemeral: true });
			return;
		}

		// Check if the channel exists in the data store.
		if (data['channel_listeners'].hasOwnProperty(channel.id)) {
			await interaction.reply({ content: "Specified channel already exists in the database.", ephemeral: true });
			return;
		}

		// Check if the userLimit is below or equal 0.
		if (userLimit <= 0) userLimit = 1;

		// Append the data.
		data['channel_listeners'][channel.id] = { 'desired_members': userLimit };
		DataManager.setData(interaction.member.guild.id, data);

		// Create an embed to show the data that just got appened.
		const embed = new EmbedBuilder()
			.setColor(0x3581D8)
			.setTitle('Added Channel')
			.addFields({ name: 'Successfully Added', value: `:bust_in_silhouette: ${userLimit} => <#${channel.id}>`, inline: false });

		// Log the channel creation.
		console.log(`[<ADD> Data Store]  ${interaction.user.username} => ${channel.name} (User Limit: ${userLimit})`);

		// Reply with the embed.
		await interaction.reply({ embeds: [embed] });
	}
};