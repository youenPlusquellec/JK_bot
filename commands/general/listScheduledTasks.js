const Command = require('../../structures/CommandClass');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const actionModel = require('../../models/action.model');

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
				.setName('listscheduledtasks')
				.setDescription('Liste les différentes actions programmée du serveur')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('Liste les actions pour le salon donné')
						.setRequired(false)),
			usage: 'listScheduledTasks [channel]',
			category: 'kanji',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {

		// Getting role parameter
		const channel = interaction.options.getChannel('channel');

		// It's a way to send a message to the user without sending it right away.
		await interaction.deferReply();

		// It's getting the actions from the database.
		let actions = [];
		if (channel && channel.id) {
			actions = await actionModel.getActionsByServerIdAndChannelId(interaction.guildId, channel.id);
		} else {
			actions = await actionModel.getActionsByServerId(interaction.guildId);
		}

		if (actions.length) {
			// It's creating an array of objects. Each object is a field of the embed.
			const json = [];
			actions.forEach((action, index) => {

				let message = '';
				message = `**#️⃣ Salon:** <#${action.channelId}>\n`;
				message += `**⚙️ Commande:** ${action.type}\n`;
				message += `**📅 Planification:** ${action.cron}\n`;
				if (action.mentionRole) {
					message += `**👤 Mentionne:** ${action.mentionRole}\n`;
				}
				if (action.parameters && action.parameters.message) {
					message += `**💬 Message:** ${action.parameters.message.slice(0, 30)}${action.parameters.message.length > 30 ? '...' : '' }\n`;
				}

				json.push({
					name: `N°${index}`,
					value: message,
					inline: false,
				});
			});

			// It's creating an embed with the information about the kanji.
			const listEmbed = new MessageEmbed()
				.setTitle(`**Liste des tâches programmées ${channel && channel.name ? `du salon \`#${channel.name}\`` : 'du serveur'}**`)
				.setURL(`https://discord.com/channels/${interaction.guildId}/${channel ? channel.id : ''}`)
				.setColor(client.config.embedColor)
				.addFields(json)
				.setTimestamp();

			return await interaction.followUp({ embeds: [listEmbed] });
		} else if (channel) {
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription('💬 Il n\'y a aucune action plannifiée pour ce salon')
					.setTimestamp(),
				],
			});
		} else {
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription('💬 Il n\'y a aucune action plannifiée pour ce serveur')
					.setTimestamp(),
				],
			});
		}

	}
};