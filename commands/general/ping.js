const Command = require('../../structures/CommandClass');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');
const logger = require('../../common/utils/logger');

const ActionRepository = require('../../model/actionRepository');
const actionRepository = new ActionRepository();

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('ping')
				.setDescription('Returns the bot ping.'),
			usage: 'ping',
			category: 'Info',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const now = Date.now();
		await interaction.deferReply();
		

		// It's a loop that runs through all the actions in the database and runs the cronFunction of the
		// command that is associated with the action.
		logger.info(`Starting cron tasks...`)
		const actionList = actionRepository.getActions()
		for (let id in actionRepository.getActions()) {
			const action = actionList[id]
			
			const command = client.commands.get(action.type);
			command.cronFunction(client, action.cron, action.channel_id, action.mention_role)
		}

		const pingEmbed = new MessageEmbed()
			.setAuthor({
				name: `${client.user.username}'s Ping`,
				icon_url: client.user.displayAvatarURL({ dynamic: true, size: 2048 }),
			})
			.setColor('#fee75c')
			.setDescription(stripIndents`
            **⏱ Roundtrip:** ${Math.round(Date.now() - now)} ms
            **💓 API:** ${Math.round(client.ws.ping)} ms
            `);

		return await interaction.followUp({ embeds: [pingEmbed] });
	}
};