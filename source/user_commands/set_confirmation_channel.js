const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DataManager } = require('../libs/manager.js');

module.exports = {
	// Build the slash command.
	data: new SlashCommandBuilder()
		.setName('set_confirmation_channel')
		.setDescription('Set the confirmation channel.')
		.addChannelOption(option => option
			.setName('channel')
			.setDescription('Set the channel.')
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

		// Check if the channel is a confirmation channel.
		if (channel.type !== 2) {
			await interaction.reply({ content: 'Specified channel is not a voice channel!', ephemeral: true });
			return;
		}

		// Set the data.
		data['confirmation_channel'] = channel.id;
		DataManager.setData(interaction.member.guild.id, data);

		// Create an embed to show the data that just got set.
		const embed = new EmbedBuilder()
			.setColor(0x3581D8)
			.setTitle('Set The Confirmation Channel')
			.addFields({ name: 'Successfully Set', value: `<#${channel.id}>`, inline: false });

		// Log the confirmation channel set.
		console.log(`[<SET> Data Store]  ${interaction.user.username} => Confirmation Channel: ${channel.name}`);

		// Reply with the embed.
		await interaction.reply({ embeds: [embed] });
	}
};