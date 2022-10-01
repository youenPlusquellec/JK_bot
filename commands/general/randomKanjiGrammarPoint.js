const Command = require('../../structures/CommandClass');
const cron = require('cron');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');
const { generateEmbedGrammar } = require('../../common/grammar/grammarMessage');

const actionModel = require('../../models/action.model');
const grammarModel = require('../../models/grammar.model');
const logger = require('../../common/utils/logger');
const path = require('path');

/* It's getting a random grammar point from the database and getting the information about it. Then, it's
creating an embed with the information about the grammar point */
module.exports = class RandomGrammarPoint extends Command {

	/**
	 * A constructor function. It is called when the class is instantiated.
	 * @param client - The client object
	 */
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('rgrammar')
				.setDescription('Renvoie un point de grammaire aléatoire')
				.addStringOption(option =>
					option.setName('scheduling')
						.setDescription('Sheduling task : "*[0-59s] *[0-59m] *[0-23h] *[1-31 day_month] *[1-12 month] *[0-7 d_week]"')
						.setRequired(false))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Pour ping un role à chaque message')
						.setRequired(false)),
			usage: 'rgrammar [scheduling] [role]',
			category: 'grammar',
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
						.setDescription(`💬 Le point de grammaire a bien été programmé en suivant la règle \`${cronTimer}\``)
						.setFooter({ text: `${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL() })
						.setTimestamp(),
					],
				});
			} else {

				// It's getting a random grammar point from a JSON file and getting the information about it.
				const randGrammarPoint = await grammarModel.getRandomGrammar();
				logger.info(`Generated grammar point : ${randGrammarPoint.japanese}`);

				if (randGrammarPoint) {

					/* It's getting a random grammar point from a JSON file and getting the information about it. Then, it's
					creating an embed with the information about the grammar point */
					const grammarPointEmbed = await generateEmbedGrammar(client.config.embedColor, randGrammarPoint, interaction.member.guild);

					/* It's sending the message to the user. */
					return await interaction.followUp({ embeds: [grammarPointEmbed], files: [path.resolve(process.env.KANJI_IMAGES_FOLDER, `grammar_${randGrammarPoint.id}.png`)] }).then(() => {
						// If there is a role to ping, ping it
						if (role) {
							client.channels.cache.get(interaction.channelId).send(role);
						}
					});
				} else {
					logger.error('Error when generating grammar point message : No more grammar point available');
					interaction.followUp({
						embeds: [new MessageEmbed()
							.setTitle('❌ Erreur lors de la génération du point de grammaire')
							.setColor(client.config.embedColor)
							.setDescription('💬 Plus aucun point de grammaire n\'est disponible')
							.setFooter({ text: `${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL() })
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
					.setFooter({ text: `${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL() })
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

			// It's getting a random grammar point from a JSON file and getting the information about it.
			const randGrammarPoint = await grammarModel.getAvailableRandomGrammar(serverId);
			logger.info(`Generated grammar point : ${randGrammarPoint.japanese}`);

			if (randGrammarPoint) {

				// Generating random randGrammarPoint message
				const grammarPointEmbed = await generateEmbedGrammar(client.config.embedColor, randGrammarPoint, client.channels.cache.get(channelId).guild);
				grammarModel.useGrammarById(randGrammarPoint.id, serverId);

				// Sending the message to the user.
				client.channels.cache.get(channelId).send({ embeds: [grammarPointEmbed], files: [path.resolve(process.env.KANJI_IMAGES_FOLDER, `grammar_${randGrammarPoint.id}.png`)] })
					.then(() => {
						// If there is a role to ping, ping it
						if (role) {
							client.channels.cache.get(channelId).send(role);
						}
					});

			} else {
				logger.error('Error when generating grammar point message : No more grammar point available');
				client.channels.cache.get(channelId).send({
					embeds: [new MessageEmbed()
						.setTitle('❌ Erreur lors de la génération du point de grammaire')
						.setColor(client.config.embedColor)
						.setDescription('💬 Plus aucun point de grammaire n\'est disponible')
						.setFooter({ text: `${client.channels.cache.get(channelId).guild.name}`, iconURL: client.channels.cache.get(channelId).guild.iconURL() })
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