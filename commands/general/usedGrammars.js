const Command = require('../../structures/CommandClass');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');

const grammarModel = require('../../models/grammar.model');
const logger = require('../../common/utils/logger');

/* It's getting a random grammar point from a JSON file and getting the information about it. Then, it's 
creating an embed with the information about the grammar point */
module.exports = class UsedGrammars extends Command {

	/**
	 * A constructor function. It is called when the class is instantiated.
	 * @param client - The client object
	 */
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('usedgrammars')
				.setDescription('Permet de manipuler les point de grammaire "utilisées"')
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
			usage: 'usedgrammars COMMAND',
			category: 'grammar',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {

		// Getting command parameter
		const command = interaction.options.getString('command');

		// It's a way to send a message to the user without sending it right away.
		await interaction.deferReply();

		// Debugging
		logger.info(`'${command}' available grammar point for server '${interaction.member.guild.name}'`);

		let listEmbed;
		if (command === 'list') {

			// It's getting the actions from the database.
			const grammar_points = await grammarModel.getUsedGrammars(interaction.guildId);

			// Checking if we-ve got values from DB
			if (grammar_points && grammar_points.length) {

				// Preparing the list of grammar points
				const json = [];
				grammar_points.slice(-25).forEach((grammar_point, index) => {

					// Add security to grammar_point.japanese
					if (typeof grammar_point.japanese === 'string') {
						grammar_point.japanese = JSON.parse(grammar_point.japanese);
					}

					json.push({
						name: `N°${index + 1}`,
						value: stripIndents`
						**🈳️ Grammaire:** ${grammar_point.japanese}
						**🆙 JTLP:** ${grammar_point.jlpt}
						**🗓️ Date:** ${grammar_point.timestamp.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' })}
					`,
						inline: true,
					});
				});

				// Preparing embed message
				listEmbed = new MessageEmbed()
					.setTitle(`Liste des points de grammaire utilisés sur '${interaction.member.guild.name}'`)
					.setColor(client.config.embedColor)
					.addFields(json)
					.setTimestamp()
					.setFooter({ text: '⚠️ La limite est de 25 points de grammaire affichés' });
				return await interaction.followUp({ embeds: [listEmbed] });
			} else {
				// In case of no grammar point used
				return await interaction.followUp({
					embeds: [new MessageEmbed()
						.setTitle('❗ Information')
						.setColor(client.config.embedColor)
						.setDescription('💬 Aucun point de grammaire épuisé sur ce serveur')
						.setTimestamp(),
					],
				});
			}

		} else if (command === 'clear') {

			// Clear database from used message for current server
			await grammarModel.clearGrammars(interaction.guildId);

			// Return confirmation message
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription('💬 L\'ensemble des points de grammaire du serveur sont de nouveau accessible par les tâches programmées')
					.setTimestamp(),
				],
			});
		} else if (command === 'restore') {

			// Clear database from used message for current server
			await grammarModel.restoreGrammars(interaction.guildId);

			// Return confirmation message
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription('💬 L\'ensemble des points de grammaire du serveur sont de nouveau accessible par les tâches programmées')
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