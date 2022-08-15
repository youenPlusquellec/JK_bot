const Command = require('../../structures/CommandClass');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');

const vocabularyModel = require('../../models/vocabulary.model');
const logger = require('../../common/utils/logger');

/* It's getting a random kanji from a JSON file and getting the information about it. Then, it's
generating an image from the kanji and saving it to a file. Finally, it's creating an embed with
the information about the kanji */
module.exports = class UsedVocabularies extends Command {

	/**
	 * A constructor function. It is called when the class is instantiated.
	 * @param client - The client object
	 */
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('usedvocabularies')
				.setDescription('Supprime une tâche programmée par son id')
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
				)
				.addNumberOption((str) =>
					str
						.setName('jlpt')
						.setDescription('Niveau de JLPT ciblé')
						.setRequired(false)
						.addChoices(
							{
								name: 'N5',
								value: 5,
							},
							{
								name: 'N4',
								value: 4,
							},
							{
								name: 'N3',
								value: 3,
							},
						),
				),
			usage: 'usedvocabularies COMMAND',
			category: 'vocabularies',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {

		// Getting command parameter
		const command = interaction.options.getString('command');

		// Getting command parameter
		const jlpt = interaction.options.getNumber('jlpt');

		// It's a way to send a message to the user without sending it right away.
		await interaction.deferReply();

		// Debugging
		logger.info(`'${command}' available vocabularies for server '${interaction.member.guild.name}'`);

		let listEmbed;
		if (command === 'list') {

			// It's getting the actions from the database.
			const vocabularies = jlpt ? await vocabularyModel.getUsedVocabulariesByJlpt(interaction.guildId, jlpt) : await vocabularyModel.getUsedVocabularies(interaction.guildId);

			// Checking if we-ve got values from DB
			if (vocabularies && vocabularies.length) {

				// Preparing the list of vocabularies
				const json = [];
				vocabularies.slice(-25).forEach((vocabulary, index) => {
					json.push({
						name: `N°${index + 1}`,
						value: stripIndents`
						**🈳️ Kanji:** ${vocabulary.vocabulary}
						**🆙 JTLP:** ${vocabulary.jlpt}
						**🗓️ Date:** ${vocabulary.timestamp}
					`,
						inline: true,
					});
				});

				// Preparing embed message
				listEmbed = new MessageEmbed()
					.setTitle(`Liste des mots de vocabulaire ${jlpt ? `N${jlpt} ` : ''}utilisés sur '${interaction.member.guild.name}'`)
					.setColor(client.config.embedColor)
					.addFields(json)
					.setTimestamp()
					.setFooter({ text: '⚠️ La limite est de 25 mots de vocabulaire affichés' });
				return await interaction.followUp({ embeds: [listEmbed] });
			} else {
				// In case of no kanji used
				return await interaction.followUp({
					embeds: [new MessageEmbed()
						.setTitle('❗ Information')
						.setColor(client.config.embedColor)
						.setDescription('💬 Aucun mot de vocabulaire épuisé sur ce serveur')
						.setTimestamp(),
					],
				});
			}

		} else if (command === 'clear') {

			// Clear database from used message for current server
			jlpt ? await vocabularyModel.clearVocabulariesByJlpt(interaction.guildId, jlpt) : await vocabularyModel.clearVocabularies(interaction.guildId);

			// Return confirmation message
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription(`💬 L\'ensemble des mots de vocabulaire ${jlpt ? `N${jlpt} ` : ''}du serveur sont de nouveau accessible par les tâches programmées`)
					.setTimestamp(),
				],
			});
		} else if (command === 'restore') {

			// Clear database from used message for current server
			jlpt ? await vocabularyModel.restoreVocabulariesByJlpt(interaction.guildId, jlpt) : await vocabularyModel.restoreVocabularies(interaction.guildId);

			// Return confirmation message
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription(`💬 L\'ensemble des mots de vocabulaire ${jlpt ? `N${jlpt} ` : ''}du serveur sont de nouveau accessible par les tâches programmées`)
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