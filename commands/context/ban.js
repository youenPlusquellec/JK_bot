const Command = require('../../structures/CommandClass');

const { MessageEmbed } = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');
const logger = require('../../common/utils/logger');

const banMessages = [
	"Oh non User ! Tu as été ban ! Mais avec un message rigolo !",
	"Au nom d'Aizen Sama, t'es ban User",
	"Ah ? Ah bah ça parle plus User ?",
	"C'est ciao User",
	"Quand je regarde comme ça on me voit. Si je regarde comme ça on me voit plus. On me voit, on me voit plus. On me voit plus, on me voit. On me voit plus, on me voit. Oups on te voit plus User.",
	"Tu es comme la fin de The Promised Neverland User",
	"Ah zut, User est parti",

]

module.exports = class Avatar extends Command {
	constructor(client) {
		super(client, {
			data: new ContextMenuCommandBuilder()
				.setName('Ban')
				.setType(ApplicationCommandType.User),
			contextDescription: 'Ban un utilisateur avec un message rigolo',
			usage: 'Avatar',
			category: 'Context',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const user = client.users.cache.get(interaction.targetId);

		const message = banMessages[Math.floor(Math.random()*banMessages.length)].replace('User', user);
		logger.info(`User '${user.username}' banned with message : ${message}`)

		await interaction.reply(message);
		interaction.options.getMember('user').ban({days: 7, reason: `Ban rigolo`});
	}
};