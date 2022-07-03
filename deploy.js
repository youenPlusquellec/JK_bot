const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const logger = require('./common/utils/logger');
const serverModel = require("./models/server.model");

const deploy = async () => {
	const commandData = [];

	fs.readdirSync('./commands/').forEach(async category => {
		const commands = fs.readdirSync(`./commands/${category}/`).filter(cmd => cmd.endsWith('.js'));

		for (const command of commands) {
			const Command = require(`./commands/${category}/${command}`);

			const cmd = new Command();

			const cmdData = cmd.data.toJSON();
			commandData.push(cmdData);
		}
	});

	const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

	try {
		const clientId = process.env.CLIENT_ID;

		// Getting linked servers
		const guildTab = await serverModel.getServers();
		const guildIdTab = guildTab.map(server => {
			return server.serverId;
		});

		logger.info('Started refreshing Slash Commands and Context Menus...');

		for(id in guildIdTab) {
			const guildId = guildIdTab[id]
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commandData },
			).then(() => {
				logger.info(`Slash Commands and Context Menus have now been deployed on ${guildId}.`);
			});
		}
	}
	catch (e) {
		console.error(e);
	}
};

deploy();