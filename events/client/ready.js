const Event = require('../../structures/EventClass');
const logger = require('../../common/utils/logger');
const ActionRepository = require('../../model/actionRepository');
const actionRepository = new ActionRepository();

module.exports = class ReadyEvent extends Event {
	constructor(client) {
		super(client, {
			name: 'ready',
			once: true,
		});
	}
	async run() {
		const client = this.client;

		client.user.setActivity('Revise ses kanji', { type: 'PLAYING' });

		logger.info(`Discord Bot is now online with ${client.users.cache.size} users and ${client.guilds.cache.size} servers.`);

		// It's a loop that runs through all the actions in the database and runs the cronFunction of the
		// command that is associated with the action.
		logger.info(`Starting cron tasks...`)
		global.cronTasks = new Map();
		const actionList = actionRepository.getActions()
		for (let id in actionRepository.getActions()) {
			const action = actionList[id]
			
			const command = client.commands.get(action.type);
			
			global.cronTasks.set(action.id, command.cronFunction(client, action.cron, action.channel_id, action.mention_role))
		}
	}
};