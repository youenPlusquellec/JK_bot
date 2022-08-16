const Command = require('../../structures/CommandClass');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');

const kanjiModel = require('../../models/kanji.model');
const logger = require('../../common/utils/logger');

/* It's getting a random kanji from a JSON file and getting the information about it. Then, it's
generating an image from the kanji and saving it to a file. Finally, it's creating an embed with
the information about the kanji */
module.exports = class UsedKanjis extends Command {

	/**
	 * A constructor function. It is called when the class is instantiated.
	 * @param client - The client object
	 */
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('usedkanjis')
				.setDescription('Permet de manipuler les kanjis "utilisées"')
				.addStringOption((str) =>
					str
						.setName('command')
						.setDescription('La commande à lancer')
						.setRequired(true)
						.addChoices(
							{
								name: 'List',
								value: 'list',
							},
							{
								name: 'Restore all',
								value: 'restore',
							},
							{
								name: 'Clear',
								value: 'clear',
							},
						),
				),
			usage: 'usedkanjis COMMAND',
			category: 'kanji',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {

		// Getting command parameter
		const command = interaction.options.getString('command');

		// It's a way to send a message to the user without sending it right away.
		await interaction.deferReply();

		// Debugging
		logger.info(`'${command}' available kanjis for server '${interaction.member.guild.name}'`);

		let listEmbed;
		if (command === 'list') {

			// It's getting the actions from the database.
			const kanjis = await kanjiModel.getUsedKanjis(interaction.guildId);

			// Checking if we-ve got values from DB
			if (kanjis && kanjis.length) {

				// Preparing the list of kanjis
				const json = [];
				kanjis.slice(-25).forEach((kanji, index) => {
					json.push({
						name: `N°${index + 1}`,
						value: stripIndents`
						**🈳️ Kanji:** ${kanji.kanji}
						**🆙 JTLP:** ${kanji.jlpt}
						**🗓️ Date:** ${kanji.timestamp.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' })}
					`,
						inline: true,
					});
				});

				// Preparing embed message
				listEmbed = new MessageEmbed()
					.setTitle(`Liste des kanjis utilisés sur '${interaction.member.guild.name}'`)
					.setColor(client.config.embedColor)
					.addFields(json)
					.setTimestamp()
					.setFooter({ text: '⚠️ La limite est de 25 kanjis affichés' });
				return await interaction.followUp({ embeds: [listEmbed] });
			} else {
				// In case of no kanji used
				return await interaction.followUp({
					embeds: [new MessageEmbed()
						.setTitle('❗ Information')
						.setColor(client.config.embedColor)
						.setDescription('💬 Aucun kanji épuisé sur ce serveur')
						.setTimestamp(),
					],
				});
			}

		} else if (command === 'clear') {

			// Clear database from used message for current server
			await kanjiModel.clearKanjis(interaction.guildId);

			// Return confirmation message
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription('💬 L\'ensemble des kanji du serveur sont de nouveau accessible par les tâches programmées')
					.setTimestamp(),
				],
			});
		} else if (command === 'restore') {

			// Clear database from used message for current server
			await kanjiModel.restoreKanjis(interaction.guildId);

			// Return confirmation message
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription('💬 L\'ensemble des kanji du serveur sont de nouveau accessible par les tâches programmées')
					.setTimestamp(),
				],
			});
		} else {
			// Return default message
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❌ Echec lors de l\'exécution')
					.setColor(client.config.embedColor)
					.setDescription('💬 La commande renseignée n\'a pas encore été implémentée')
					.setTimestamp(),
				],
			});
		}

	}
};