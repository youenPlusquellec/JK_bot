const Event = require('../../structures/EventClass');
const logger = require('../../common/utils/logger');

module.exports = class MessageCreate extends Event {
	constructor(client) {
		super(client, {
			name: 'messageCreate',
			category: 'messages',
		});
	}
	async run(message) {

		global.lastMessages.push({
			id: message.id,
			userId: message.author.id,
			channelId: message.channelId,
			timestamp: message.createdTimestamp,
			content: message.content,
		});

		const userMessagesIn5s = global.lastMessages.filter(function(item) {
			return item.userId == message.author.id;
		});

		if (userMessagesIn5s.length > 2 && userMessagesIn5s[0].channelId != userMessagesIn5s[1].channelId && userMessagesIn5s[1].channelId != userMessagesIn5s[2].channelId && userMessagesIn5s[0].channelId != userMessagesIn5s[2].channelId) {

			logger.info(`User '${message.author}' is SPAMING, preparing exclusion`);

			// Delete messages from channels
			userMessagesIn5s.forEach(element => {
				this.client.channels.fetch(element.channelId).then(channel => {
					channel.messages.fetch(element.id).then(msg =>
						msg.delete(),
					);
				});
			});
			logger.info(`Last messages from '${message.author}' has been deleted`);

			// Delete messages from array
			userMessagesIn5s.forEach(element => {
				global.lastMessages.splice(global.lastMessages.findIndex(function(item) {
					return item.id === element.id;
				}), 1);
			});

			// Create link invitation
			const invite = await message.channel.createInvite(
				{
					maxAge: 10 * 60 * 1000,
					maxUses: 1,
				}).catch(console.log);

			// Send url invitation
			message.author.send(invite ? `Vous avez été exclu du serveur pour SPAM Bot, pour revenir, cliquez sur ce lien: ${invite}` : 'Vous avez été exclu du serveur pour SPAM Bot, aucune invitation n\'a pu être générée.').then(() => {

				this.client.channels.fetch(message.channelId).then(channel => {
					channel.send(`<@${message.author.id}> a été exclu pour SPAM Bot !`);
				});
				message.member.kick('SPAM bot');

			});
			logger.info(`Member '${message.author}' kicked`);
		}
	}
};