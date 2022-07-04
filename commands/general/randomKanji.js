const Command = require('../../structures/CommandClass');
const cron = require('cron');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');
const { generateEmbedKanji } = require('../../common/kanji/kanjiMessage');

const actionModel = require('../../models/action.model');
const kanjiModel = require('../../models/kanji.model');
const logger = require('../../common/utils/logger');
const path = require('path');

/* It's getting a random kanji from a JSON file and getting the information about it. Then, it's
generating an image from the kanji and saving it to a file. Finally, it's creating an embed with
the information about the kanji */
module.exports = class RandomKanji extends Command {

	/**
	 * A constructor function. It is called when the class is instantiated.
	 * @param client - The client object
	 */
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('rkanji')
				.setDescription('Renvoie un kanji aléatoire')
				.addStringOption(option =>
					option.setName('scheduling')
						.setDescription('Sheduling task : "*[0-59s] *[0-59m] *[0-23h] *[1-31 day_month] *[1-12 month] *[0-7 d_week]"')
						.setRequired(false))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Pour ping un role à chaque message')
						.setRequired(false)),
			usage: 'rkanji',
			category: 'kanji',
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
						.setDescription(`💬 Le kanji a bien été programmé en suivant la règle \`${cronTimer}\``)
						.setTimestamp(),
					],
				});
			} else {

				// It's getting a random kanji from a JSON file and getting the information about it.
				const randKanji = await kanjiModel.getRandomKanji();
				logger.info(`Generated kanji : ${randKanji.kanji}`);

				if (randKanji) {

					/* It's getting a random kanji from a JSON file and getting the information about it. Then, it's
					generating an image from the kanji and saving it to a file. Finally, it's creating an embed with
					the information about the kanji */
					const kanjiEmbed = await generateEmbedKanji(client.config.embedColor, randKanji);

					/* It's sending the message to the user. */
					return await interaction.followUp({ embeds: [kanjiEmbed], files: [path.resolve(process.env.KANJI_IMAGES_FOLDER, `${randKanji.id}.png`)] }).then(() => {
						// If there is a role to ping, ping it
						if (role) {
							client.channels.cache.get(interaction.channelId).send(role);
						}
					});
				} else {
					logger.error('Error when generating kanji message : No more kanji available');
					interaction.followUp({
						embeds: [new MessageEmbed()
							.setTitle('❌ Erreur lors de la génération du kanji')
							.setColor(client.config.embedColor)
							.setDescription('💬 Plus aucun kanji n\'est disponible')
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

			// It's getting a random kanji from a JSON file and getting the information about it.
			const randKanji = await kanjiModel.getAvailableRandomKanji(serverId);
			logger.info(`Generated kanji : ${randKanji.kanji}`);

			if (randKanji) {

				// Generating random kanji message
				const kanjiEmbed = await generateEmbedKanji(client.config.embedColor, randKanji);
				kanjiModel.useKanjiById(randKanji.id, serverId);

				// Sending the message to the user.
				client.channels.cache.get(channelId).send({ embeds: [kanjiEmbed], files: [path.resolve(process.env.KANJI_IMAGES_FOLDER, `${randKanji.id}.png`)] })
					.then(() => {
						// If there is a role to ping, ping it
						if (role) {
							client.channels.cache.get(channelId).send(role);
						}
					});

			} else {
				logger.error('Error when generating kanji message : No more kanji available');
				client.channels.cache.get(channelId).send({
					embeds: [new MessageEmbed()
						.setTitle('❌ Erreur lors de la génération du kanji')
						.setColor(client.config.embedColor)
						.setDescription('💬 Plus aucun kanji n\'est disponible')
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