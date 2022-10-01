const Command = require('../../structures/CommandClass');
const cron = require('cron');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');

const actionModel = require('../../models/action.model');
const logger = require('../../common/utils/logger');


module.exports = class ScheduledMessage extends Command {

	/**
	 * A constructor function. It is called when the class is instantiated.
	 * @param client - The client object
	 */
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('scheduledmessage')
				.setDescription('Envoie un message programmé')
				.addStringOption(option =>
					option.setName('message')
						.setDescription('Message à envoyer')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('scheduling')
						.setDescription('Sheduling task : "*[0-59s] *[0-59m] *[0-23h] *[1-31 day_month] *[1-12 month] *[0-7 d_week]"')
						.setRequired(true))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Pour ping un role à chaque message')
						.setRequired(false)),
			usage: 'scheduledmessage MESSAGE SCHEDULING [ROLE]',
			category: 'message',
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

			// Getting message parameter
			const messageParam = interaction.options.getString('message');

			// Getting role parameter
			const roleParam = interaction.options.getRole('role');
			const role = roleParam ? `<@&${roleParam.id}>` : null;

			// Launching task in background if defined
			const res = await actionModel.createAction(interaction.guildId, interaction.user.id, this.name, cronTimer, interaction.channelId, role, {
				message: messageParam,
			});
			global.cronTasks.set(Number(res.insertId), this.cronFunction(client, interaction.guildId, cronTimer, interaction.channelId, role, {
				message: messageParam,
			}));

			// Confirmation message
			return await interaction.followUp({
				embeds: [new MessageEmbed()
					.setTitle('❗ Information')
					.setColor(client.config.embedColor)
					.setDescription(`💬 Le message a bien été programmé en suivant la règle \`${cronTimer}\``)
					.setFooter({ text: `${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL() })
					.setTimestamp(),
				],
			});

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

	cronFunction(client, serverId, cronTimer, channelId, role, parameters) {
		// Add security to parameters
		if (typeof parameters === 'string') {
			parameters = JSON.parse(parameters);
		}

		// Getting message parameter
		const message = parameters.message;
		if (!message) {
			logger.error(`Cron function of '${this.name}' cannot get 'message' parameter from json`);
			return;
		}

		logger.info(`Starting new ${this.name} with rule ${cronTimer} ${channelId ? `in #${channelId}` : ''} ${role ? `pinging ${role}` : ''} sending '${message}'`);

		// Scheduling message
		const scheduledMessage = new cron.CronJob(cronTimer, async () => {

			logger.info(`Scheduled task ${this.name} was called with rule ${cronTimer} ${channelId ? `in #${channelId}` : ''} ${role ? `pinging ${role}` : ''} sending '${message}'`);

			client.channels.cache.get(channelId).send(`${role ? role : ''} ${message}`);
		});

		// Launch scheduled message
		scheduledMessage.start();

		// Returning cron task
		return scheduledMessage;
	}
};