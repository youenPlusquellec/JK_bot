const Event = require('../../structures/EventClass');
const logger = require('../../common/utils/logger');
const actionModel = require('../../models/action.model');
const serverModel = require('../../models/server.model');
const { deploy } = require('./deploy');

module.exports = class ReadyEvent extends Event {
	constructor(client) {
		super(client, {
			name: 'ready',
			once: true,
		});
	}
	async run() {
		const client = this.client;

		// Deploy commands on servers
		if (client.config.deployOnStart) {
			await deploy(client.guilds.cache);
		}

		client.user.setActivity('Revise ses kanji', { type: 'PLAYING' });

		logger.info(`Discord Bot is now online with ${client.users.cache.size} users and ${client.guilds.cache.size} servers.`);


		/** ***************** Anti SPAM *******************/
		// Declare global variable to store last messages sent
		global.lastMessages = [];

		// Delete messages from the list after 5 seconds for anti-spam
		setInterval(function() {
			const time = Date.now();
			global.lastMessages = global.lastMessages.filter(function(item) {
				return time < item.timestamp + (5000);
			});
		}, 500);

		// It's a loop that runs through all the actions in the database and runs the cronFunction of the
		// command that is associated with the action.
		logger.info('Starting cron tasks...');
		global.cronTasks = new Map();

		// Start every cron task stored in db
		const actionList = await actionModel.getActions();
		actionList.forEach(async (action) => {
			const command = client.commands.get(action.type);

			const server = await serverModel.getServerById(action.serverId);

			global.cronTasks.set(action.id, command.cronFunction(action.id, client, server[0].serverId, action.cron, action.channelId, action.mentionRole, action.parameters));
		});
	}
};