const Command = require('../../structures/CommandClass');
const cron = require('cron');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');

const ActionRepository = require('../../model/actionRepository');
const actionRepository = new ActionRepository();
const { Logger } = require('log4js');

/* It's getting a random kanji from a JSON file and getting the information about it. Then, it's
generating an image from the kanji and saving it to a file. Finally, it's creating an embed with
the information about the kanji */
module.exports = class ListScheduledTasks extends Command {

	/**
	 * A constructor function. It is called when the class is instantiated.
	 * @param client - The client object
	 */
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('removetask')
				.setDescription('Supprime une tâche programmée par son id')
				.addIntegerOption(option =>
					option.setName('id')
						.setDescription('Identifiant de la tâche à supprimer')
						.setRequired(true))
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription("Filtre par salon")
						.setRequired(false)),
			usage: 'listScheduledTasks',
			category: 'kanji',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {

		// Getting channel parameter
		const channel = interaction.options.getChannel('channel');

		// Getting id parameter
		const id = interaction.options.getInteger('id');

		// It's a way to send a message to the user without sending it right away.
		await interaction.deferReply();

		// It's getting the actions from the database.
		let action = {}
		if (channel && channel.id) {
			action = actionRepository.deleteActionsByIdAndServerIdAndChannelId(id, interaction.guildId, channel.id)
		} else {
			action = actionRepository.deleteActionByIdAndServerId(id, interaction.guildId)
		}

		// It's creating an embed with the information about the kanji.
		const listEmbed = new MessageEmbed()
			.setTitle(`**La tâche suivante vient d'être supprimée**`)
			//.setURL(`https://discord.com/channels/${interaction.guildId}/${channel ? channel.id : ""}`)
			.setColor(client.config.embedColor)
			.addFields({
				name: `N°${id}`,
				value: stripIndents`
					${!channel ? `**#️⃣ Salon:** <#${action.channel_id}>` : ""}
					**⚙️ Commande:** ${action.type}
					**📅 Planification:** ${action.cron}
					${action.mention_role ? `**👤 Mentionne:** ${action.mention_role}` : ""}
				`,
				inline: false
			})
			.setTimestamp();

		return await interaction.followUp({ embeds: [listEmbed] })
	}
};