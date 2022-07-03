const Event = require('../../structures/EventClass');
const logger = require('../../common/utils/logger');
const historyModel = require("../../models/history.model");
const serverModel = require("../../models/server.model");
const userModel = require("../../models/user.model");

module.exports = class InteractionCreate extends Event {
	constructor(client) {
		super(client, {
			name: 'interactionCreate',
			category: 'interactions',
		});
	}
	async run(interaction) {
		const client = this.client;

		if (interaction.isContextMenu() || interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (interaction.user.bot) return;
			if (!interaction.inGuild() && interaction.isCommand()) return interaction.editReply({ content: 'You must be in a server to use commands.' });

			if (!command) return interaction.reply({ content: 'This command is unavailable. *Check back later.*', ephemeral: true }) && client.commands.delete(interaction.commandName);

			try {
				await serverModel.addServer(interaction.guildId, interaction.member.guild.name);
				await userModel.addUser(interaction.user.id, interaction.user.username);

				historyModel.addToHistory(command.name, interaction.user.id, interaction.guildId);

				command.run(client, interaction);
			}
			catch (e) {
				logger.error(e);
				return interaction.reply({ content: `An error has occurred.\n\n**\`${e.message}\`**` });
			}
		}

		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'prefixForm') {
				const prefix = interaction.fields.getTextInputValue('prefix');

				return await interaction.reply({ content: `Prefix has been set to: **\`${prefix}\`**` });
			}
		}
	}
};