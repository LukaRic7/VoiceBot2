const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DataManager } = require('../libs/manager.js');

module.exports = {
	// Build the slash command.
	data: new SlashCommandBuilder()
		.setName('get_settings')
		.setDescription('Get a list of the current settings.'),

	// Function called when the command is executed.
	async execute(interaction) {
		// Get the data/settings associated with the guild.
		const data = DataManager.getData(interaction.member.guild.id);

		// Check if there is data available
		if (data['channel_listeners'] === {} || data['confirmation_channel'] === '' || data['temp_channels_category'] === '') {
			await interaction.reply({ content: ':exclamation:**Set up the channels first**:exclamation:' });
			return;
		}

		// Sort and format the fields.
		const result = Object.entries(data['channel_listeners']).map(([key, listener]) => `:bust_in_silhouette: ${listener['desired_members']} => <#${key}>`).join('\n');

		// Create an embed to display the current settings.
		const embed = new EmbedBuilder()
			.setColor(0x3581D8)
			.setTitle('Current Settings')
			.addFields(
				{ name: 'Confirmation Channel', value: `<#${data['confirmation_channel']}>`, inline: false },
				{ name: 'Temp Channels Category', value: `<#${data['temp_channels_category']}>`, inline: false },
				{ name: 'Channel Listeners', value: result, inline: false },
			);

		// Reply with the embed.
		await interaction.reply({ embeds: [embed] });
	}
};