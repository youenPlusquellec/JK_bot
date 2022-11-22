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
						.setRequired(false))
				.addChannelOption(option =>
					option.setName('target_channel')
						.setDescription('Salon cible de l\'action programmée')
						.setRequired(false))
				.addBooleanOption(option =>
					option.setName('to_use')
						.setDescription('Si l\'action doit dépenser ou non points de grammaire')
						.setRequired(false)),
			usage: 'rgrammar [scheduling] [role] [target_channel] [to_use]',
			category: 'grammar',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {

		// It's a way to send a message to the user without sending it right away.
		await interaction.deferReply();

		// Getting parameter
		const cronTimer = interaction.options.getString('scheduling');
		const toUse = interaction.options.getBoolean('to_use');
		const selectedChannel = interaction.options.getChannel('target_channel') ? interaction.options.getChannel('target_channel').id : interaction.channelId;

		// Check if cron timer respects cron requirements
		if (cronTimer && !/^(\*|((\*\/)?[1-5]?[0-9])) (\*|((\*\/)?[1-5]?[0-9])) (\*|((\*\/)?(1?[0-9]|2[0-3]))) (\*|((\*\/)?([1-9]|[12][0-9]|3[0-1]))) (\*|((\*\/)?([1-9]|1[0-2]))) (\*|((\*\/)?[0-6]))$/.test(cronTimer)) {
			logger.error('Cron tab value is not valid');
			return interaction.followUp({
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

		// Getting role parameter
		const roleParam = interaction.options.getRole('role');
		const role = roleParam ? `<@&${roleParam.id}>` : null;

		// Launching task in background if defined
		if (cronTimer) {
			const res = await actionModel.createAction(interaction.guildId, interaction.user.id, this.name, cronTimer, selectedChannel, role, {
				toUse: toUse != undefined ? toUse : true,
			});

			global.cronTasks.set(Number(res.insertId), this.cronFunction(Number(res.insertId), client, interaction.guildId, cronTimer, selectedChannel, role, {
				toUse: toUse != undefined ? toUse : true,
			}));

			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription(`💬 Le point de grammaire a bien été programmé en suivant la règle \`${cronTimer}\` dans le channel <#${selectedChannel}>`)
					.setFooter({ text: `${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL() })
					.setTimestamp(),
				],
			});

		} else {

			// It's getting a random grammar point from a JSON file and getting the information about it.
			const randGrammarPoint = await grammarModel.getRandomGrammar();

			if (!randGrammarPoint) {

				logger.error('Error when generating grammar point message : No more grammar point available');
				return interaction.followUp({
					embeds: [new MessageEmbed()
						.setTitle('❌ Erreur lors de la génération du point de grammaire')
						.setColor(client.config.embedColor)
						.setDescription('💬 Plus aucun point de grammaire n\'est disponible')
						.setFooter({ text: `${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL() })
						.setTimestamp(),
					],
				});
			}

			/* It's getting a random grammar point from a JSON file and getting the information about it. Then, it's
			creating an embed with the information about the grammar point */
			const grammarPointEmbed = await generateEmbedGrammar(client.config.embedColor, randGrammarPoint, interaction.member.guild);
			logger.info(`Sending random kanji ${randGrammarPoint.japanese} embed message in channel ${selectedChannel}`);

			// Use grammar point
			if (toUse) {
				logger.debug(`Use grammar point for scheduled task : ${randGrammarPoint.japanese}`);
				grammarModel.useGrammarById(randGrammarPoint.id, interaction.member.guild.id);
			}

			/* Reply to the message if the selected channel is the current channel, otherwise makes a short response */
			if (selectedChannel == interaction.channelId) {
				return await interaction.followUp({ embeds: [grammarPointEmbed], files: [path.resolve(process.env.KANJI_IMAGES_FOLDER, `grammar_${randGrammarPoint.id}.png`)] }).then(() => {
					if (role) {
						client.channels.cache.get(selectedChannel).send(role);
					}
				});
			} else {
				return await interaction.followUp({
					embeds: [new MessageEmbed()
						.setTitle('❗ Information')
						.setColor(client.config.embedColor)
						.setDescription(`💬 Le point de grammaire a bien été envoyé dans le channel <#${selectedChannel}>`)
						.setFooter({ text: `${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL() })
						.setTimestamp(),
					],
				}).then(() => {
					client.channels.cache.get(selectedChannel).send({ embeds: [grammarPointEmbed], files: [path.resolve(process.env.KANJI_IMAGES_FOLDER, `grammar_${randGrammarPoint.id}.png`)] }).then(() => {
						if (role) {
							client.channels.cache.get(selectedChannel).send(role);
						}
					});

				});
			}
		}
	}

	cronFunction(id, client, serverId, cronTimer, channelId, role, params) {

		logger.info(`Starting new ${this.name} with rule ${cronTimer} ${channelId ? `in #${channelId}` : ''} ${role ? `pinging ${role}` : ''}`);

		// Scheduling message
		const scheduledMessage = new cron.CronJob(cronTimer, async () => {

			logger.info(`Scheduled task ${this.name} was called with rule ${cronTimer} ${channelId ? `in #${channelId}` : ''} ${role ? `pinging ${role}` : ''}`);

			// Delete the action if the bot cannot access to the channel
			if (!client.channels.cache.get(channelId)) {

				// Informations
				logger.error(`Channel #${channelId} does not exist anymore. Deleting action #${id} of type ${this.name}.`);

				// Delete cron task
				global.cronTasks.get(id).stop();
				global.cronTasks.delete(id);

				// Delete in db
				actionModel.deleteActionById(id);

				// Skip action
				return;
			}

			// It's getting a random grammar point from a JSON file and getting the information about it.
			const randGrammarPoint = await grammarModel.getAvailableRandomGrammar(serverId);

			if (randGrammarPoint) {

				// Generating random randGrammarPoint message
				const grammarPointEmbed = await generateEmbedGrammar(client.config.embedColor, randGrammarPoint, client.channels.cache.get(channelId).guild);
				logger.info(`Sending random kanji ${randGrammarPoint.japanese} embed message in channel ${channelId}`);

				// Use grammar point
				if (params && params.toUse) {
					logger.debug(`Use grammar point for scheduled task : ${randGrammarPoint.japanese}`);
					grammarModel.useGrammarById(randGrammarPoint.id, serverId);
				}

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