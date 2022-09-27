const Command = require('../../structures/CommandClass');
const cron = require('cron');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');
const { generateEmbedVocabularies } = require('../../common/vocabulary/vocabularyMessage');

const actionModel = require('../../models/action.model');
const vocabularyModel = require('../../models/vocabulary.model');
const logger = require('../../common/utils/logger');

/* It's getting 3 random vocabularies from the database and getting the information about it. Then, it's creating an embed with
the information about vocabularies */
module.exports = class RandomVocabulary extends Command {

	/**
	 * A constructor function. It is called when the class is instantiated.
	 * @param client - The client object
	 */
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('rvocabulary')
				.setDescription('Renvoie un exercice de vocabulaire aléatoire du niveau N5 à N3')
				.addStringOption(option =>
					option.setName('scheduling')
						.setDescription('Sheduling task : "*[0-59s] *[0-59m] *[0-23h] *[1-31 day_month] *[1-12 month] *[0-7 d_week]"')
						.setRequired(false))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Pour ping un role à chaque message')
						.setRequired(false)),
			usage: 'rvocabulary [scheduling] [role]',
			category: 'vocabulary',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {

		// It's a way to send a message to the user without sending it right away.
		await interaction.deferReply();

		// Getting cron parameter
		const cronTimer = interaction.options.getString('scheduling');

		// Check if cron timer respects cron requirements
		if (!cronTimer || (cronTimer && /^(\*|((\*\/)?[1-5]?[0-9])) (\*|((\*\/)?[1-5]?[0-9])) (\*|((\*\/)?(1?[0-9]|2[0-3]))) (\*|((\*\/)?([1-9]|[12][0-9]|3[0-1]))) (\*|((\*\/)?([1-9]|1[0-2]))) (\*|((\*\/)?[0-6]))$/.test(cronTimer))) {

			// Getting role parameter
			const roleParam = interaction.options.getRole('role');
			const role = roleParam ? `<@&${roleParam.id}>` : null;

			// Launching task in background if defined
			if (cronTimer) {
				const res = await actionModel.createAction(interaction.guildId, interaction.user.id, this.name, cronTimer, interaction.channelId, role);

				global.cronTasks.set(Number(res.insertId), this.cronFunction(client, interaction.guildId, cronTimer, interaction.channelId, role));

				return await interaction.followUp({
					embeds: [new MessageEmbed()
						.setTitle('❗ Information')
						.setColor(client.config.embedColor)
						.setDescription(`💬 L'exercice de vocabulaire a bien été programmé en suivant la règle \`${cronTimer}\``)
						.setTimestamp(),
					],
				});
			} else {

				/* Get random vocabulary for each jlpt levels*/
				const randVocN5 = await vocabularyModel.getRandomVocabularyByJlpt(5);
				const randVocN4 = await vocabularyModel.getRandomVocabularyByJlpt(4);
				const randVocN3 = await vocabularyModel.getRandomVocabularyByJlpt(3);
				logger.info(`Generated vocabularies : ${randVocN5.vocabulary} - ${randVocN4.vocabulary} - ${randVocN3.vocabulary}`);

				if (randVocN5 && randVocN4 && randVocN3) {

					/* Generate the vocabularies embed message */
					const vocEmbed = await generateEmbedVocabularies(client.config.embedColor, randVocN5, randVocN4, randVocN3, interaction.member.guild.iconURL());

					/* It's sending the message to the user. */
					return await interaction.followUp({ embeds: [vocEmbed] }).then(() => {
						// If there is a role to ping, ping it
						if (role) {
							client.channels.cache.get(interaction.channelId).send(role);
						}
					});
				} else {
					logger.error('Error when generating vocabulary message : No more vocabulary available');
					interaction.followUp({
						embeds: [new MessageEmbed()
							.setTitle('❌ Erreur lors de la génération du vocabulaire')
							.setColor(client.config.embedColor)
							.setDescription('💬 Plus aucun vocabulaire n\'est disponible')
							.setTimestamp(),
						],
					});
				}
			}
		} else {
			interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❌ Le paramètre évènementiel n\'est pas correct')
					.setColor(client.config.embedColor)
					.setDescription(stripIndents`
							💬 La valeur \`${cronTimer}\` ne respecte pas la nomenclature d'une crontab 
							🔗 Documentation des cronTab : https://fr.wikipedia.org/wiki/Cron`)
					.setTimestamp(),
				],
			});
		}

	}

	cronFunction(client, serverId, cronTimer, channelId, role) {

		logger.info(`Starting new ${this.name} with rule ${cronTimer} ${channelId ? `in #${channelId}` : ''} ${role ? `pinging ${role}` : ''}`);

		// Scheduling message
		const scheduledMessage = new cron.CronJob(cronTimer, async () => {

			logger.info(`Scheduled task ${this.name} was called with rule ${cronTimer} ${channelId ? `in #${channelId}` : ''} ${role ? `pinging ${role}` : ''}`);

			/* Get random vocabulary for each jlpt levels*/
			const randVocN5 = await vocabularyModel.getAvailableRandomVocabularyByJlpt(serverId, 5);
			const randVocN4 = await vocabularyModel.getAvailableRandomVocabularyByJlpt(serverId, 4);
			const randVocN3 = await vocabularyModel.getAvailableRandomVocabularyByJlpt(serverId, 3);
			logger.info(`Generated vocabularies : ${randVocN5.vocabulary} - ${randVocN4.vocabulary} - ${randVocN3.vocabulary}`);

			if (randVocN5 && randVocN4 && randVocN3) {

				// It's generating an embed with the information about the vocabulary
				const vocEmbed = await generateEmbedVocabularies(client.config.embedColor, randVocN5, randVocN4, randVocN3, client.channels.cache.get(channelId).guild.iconURL());

				// Use the three vocabularies got
				vocabularyModel.useVocabularyById(randVocN3.id, serverId);
				vocabularyModel.useVocabularyById(randVocN4.id, serverId);
				vocabularyModel.useVocabularyById(randVocN5.id, serverId);

				// Sending the message to the user.
				client.channels.cache.get(channelId).send({ embeds: [vocEmbed] })
					.then(() => {
						// If there is a role to ping, ping it
						if (role) {
							client.channels.cache.get(channelId).send(role);
						}
					});

			} else {
				logger.error('Error when generating vocabulary message : No more vocabulary available');
				client.channels.cache.get(channelId).send({
					embeds: [new MessageEmbed()
						.setTitle('❌ Erreur lors de la génération du vocabulaire')
						.setColor(client.config.embedColor)
						.setDescription('💬 Plus aucun vocabulaire n\'est disponible')
						.setTimestamp(),
					],
				});
			}

		});

		// Launch scheduled message
		scheduledMessage.start();

		// Returning cron task
		return scheduledMessage;
	}
};