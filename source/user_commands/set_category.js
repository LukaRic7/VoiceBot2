const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DataManager } = require('../libs/manager.js');

module.exports = {
	// Build the slash command.
	data: new SlashCommandBuilder()
		.setName('set_category')
		.setDescription('Set the category for temp channels to appear under.')
		.addChannelOption(option => option
			.setName('category')
			.setDescription('Set the category.')
			.setRequired(true)),

	// Function called when the command is executed.
	async execute(interaction) {
		// Check if the user is the owner.
		if (interaction.user.id !== interaction.guild.ownerId) {
			await interaction.reply({ content: 'You need to be the owner of the server to perform this action.', ephemeral: true })
			return;
		}

		// Grab the options
		const category = interaction.options.getChannel('category');
		const data = DataManager.getData(interaction.member.guild.id);

		// Check if the channel is a category.
		if (category.type !== 4) {
			await interaction.reply({ content: 'Specified channel is not a category!', ephemeral: true });
			return;
		}

		// Set the data.
		data['temp_channels_category'] = category.id;
		DataManager.setData(interaction.member.guild.id, data);

		// Create an embed to show the data that just got set.
		const embed = new EmbedBuilder()
			.setColor(0x3581D8)
			.setTitle('Set The Category')
			.addFields({ name: 'Successfully Set', value: `<#${category.id}>`, inline: false });

		// Log the category set.
		console.log(`[<SET> Data Store]  ${interaction.user.username} => Category: ${category.name}`);

		// Reply with the embed.
		await interaction.reply({ embeds: [embed] });
	}
};