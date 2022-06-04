const Command = require('../../structures/CommandClass');
const cron = require('cron');

const { MessageEmbed, MessageAttachment, ApplicationCommandOptionType } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');
const { generateEmbedKanji } = require("../../kanji/kanjiMessage")

const ActionRepository = require('../../model/actionRepository');
const actionRepository = new ActionRepository();
const { Logger } = require('log4js');

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

		// Getting cron parameter
		const cronTimer = interaction.options.getString('scheduling');

		// Getting role parameter
		const roleParam = interaction.options.getRole('role');
		const role = roleParam ? `<@&${roleParam.id}>` : null;

		/* It's a way to send a message to the user without sending it right away. */
		await interaction.deferReply();

		/* It's getting a random kanji from a JSON file and getting the information about it. Then, it's
		generating an image from the kanji and saving it to a file. Finally, it's creating an embed with
		the information about the kanji */
		let kanjiEmbed = await generateEmbedKanji(client, role)

		// Launching task in background if defined
		if (cronTimer) {
			actionRepository.createAction(this.name, cronTimer, interaction.guildId, interaction.channelId, role)
			this.cronFunction(client, cronTimer, interaction.channelId, role);
			return await interaction.followUp(`Le kanji a bien été programmé en suivant la règle \`${cronTimer}\``)
		} else {
			/* It's sending the message to the user. */
			return await interaction.followUp({ embeds: [kanjiEmbed], files: ['./out.png'] }).then(() => {
				// If there is a role to ping, ping it
				if(role) {
					client.channels.cache.get(interaction.channelId).send(role);
				} 
			});
		}
	}

	cronFunction(client, cronTimer, channelId, role) {

		// Scheduling message
		let scheduledMessage = new cron.CronJob(cronTimer, async () => {

			// Generating random kanji message
			let kanjiEmbed = await generateEmbedKanji(client, role)

			// Sending the message to the user.
			client.channels.cache.get(channelId).send({ embeds: [kanjiEmbed], files: ['./out.png'] })
				.then(() => {
					// If there is a role to ping, ping it
					if(role) {
						client.channels.cache.get(channelId).send(role);
					} 
				});

		});

		// Launch scheduled message
		scheduledMessage.start()
	}
};