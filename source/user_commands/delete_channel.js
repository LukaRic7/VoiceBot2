const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DataManager } = require('../libs/manager.js');

module.exports = {
	// Build the slash command.
	data: new SlashCommandBuilder()
		.setName('delete_channel')
		.setDescription('Delete a channel listener.')
		.addChannelOption(option => option
			.setName('channel')
			.setDescription('Choose the channel to delete.')
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
		const data = DataManager.getData(interaction.member.guild.id);

		// Check if the channel exists in the data store.
		if (!data['channel_listeners'].hasOwnProperty(channel.id)) {
			await interaction.reply({ content: "Specified channel doesn't exist in the database.", ephemeral: true });
			return;
		}

		// Delete the data
		delete data['channel_listeners'][channel.id];
		DataManager.setData(interaction.member.guild.id, data);

		// Create an embed to show the data that just got edited.
		const embed = new EmbedBuilder()
			.setColor(0x3581D8)
			.setTitle('Deleted Channel')
			.addFields({ name: 'Successfully Deleted', value: `<#${channel.id}>`, inline: false });

		// Log the channel edit.
		console.log(`[<DEL> Data Store]  ${interaction.user.username} => ${channel.name}`);

		// Reply with the embed.
		await interaction.reply({ embeds: [embed] });
	}
};