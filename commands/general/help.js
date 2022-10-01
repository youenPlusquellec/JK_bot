const Command = require('../../structures/CommandClass');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('help')
				.setDescription('Returns command information.')
				.addStringOption((str) =>
					str
						.setName('command')
						.setDescription('The command you want to get help for.')
						.setRequired(true)
						.addChoices(
							{
								name: 'Random Kanji',
								value: 'rkanji',
							},
							{
								name: 'Used Kanjis',
								value: 'usedkanjis',
							},
							{
								name: 'Random Vocabulary',
								value: 'rvocabulary',
							},
							{
								name: 'List Scheduled Tasks',
								value: 'listscheduledtasks',
							},
							{
								name: 'Remove Task',
								value: 'removetask',
							},
							{
								name: 'Scheduled Message',
								value: 'scheduledmessage',
							},
							{
								name: 'Help',
								value: 'help',
							},
						),
				),
			usage: 'help <command>',
			category: 'Info',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {
		const query = interaction.options.getString('command');

		if (query.toLowerCase()) {
			if (client.commands.has(query)) {
				const command = client.commands.get(query);

				const commandEmbed = new MessageEmbed()
					.setTitle(`**\`${command.name}\`** Command Information`)
					.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
					.setColor(client.config.embedColor)
					.setDescription(stripIndents`
                    > ${command.contextDescription ? command.contextDescription : command.description}

                    **Usage:** ${command.contextDescription ? 'Right-Click > Apps > ' : '/'}${command.usage}
                    **Category:** ${command.category}
                    **Permissions Needed:** ${command.permissions[0] ? `${command.permissions.join(', ')}` : 'None'}
                    `)
					.setFooter({ text: `${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL() })
					.setTimestamp();

				await interaction.reply({ embeds: [commandEmbed] });
			} else {
				interaction.reply({ content: `Command **\`${query}\`** was not found.` });
			}
		}
	}
};