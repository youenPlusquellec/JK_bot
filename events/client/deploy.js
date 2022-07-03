const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const logger = require('../../common/utils/logger');

module.exports = {
	async deploy(guildIdTab) {
		const commandData = [];

		fs.readdirSync(path.join(__dirname, `../../commands/`)).forEach(async category => {
			const commands = fs.readdirSync(path.join(__dirname, `../../commands/${category}/`)).filter(cmd => cmd.endsWith('.js'));

			for (const command of commands) {
				const Command = require(path.join(__dirname, `../../commands/${category}/${command}`));

				const cmd = new Command();

				const cmdData = cmd.data.toJSON();
				commandData.push(cmdData);
			}
		});

		const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

		try {
			const clientId = process.env.CLIENT_ID;

			logger.info('Started refreshing Slash Commands and Context Menus...');

			guildIdTab.forEach(async (value, key) => {
				const guildId = key.toString()
				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commandData },
				).then(() => {
					logger.info(`Slash Commands and Context Menus have now been deployed on ${guildId}.`);
				});
			});
		} catch (e) {
			console.error(e);
		}
	},
}
