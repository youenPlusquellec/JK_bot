const Command = require('../../structures/CommandClass');

const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');
const logger = require('../../common/utils/logger');

const banMessages = [
	'Oh non User ! Tu as été ban ! Mais avec un message rigolo !',
	'Au nom d\'Aizen Sama, t\'es ban User',
	'Ah ? Ah bah ça parle plus User ?',
	'C\'est ciao User',
	'Quand je regarde comme ça on me voit. Si je regarde comme ça on me voit plus. On me voit, on me voit plus. On me voit plus, on me voit. On me voit plus, on me voit. Oups on te voit plus User.',
	'Tu es comme la fin de The Promised Neverland User',
	'Ah zut, User est parti',
	'Technique d\'Extension du Territoire : La Sphère de L\'espace Infini. User a été désintégré.',
	'Tu as fini comme la maman d\'Eren User',
	'Usopp Golden Hammer sur User',
	'Oups, User a raté la marche et est tombé du serveur 🙄',
	'Userの言語わからん、ごめんごめん',
	'Il semblerait que User ait cliqué sur un lien de désinvitation',
	'Il ne faut jamais embêter un modo qui attend sa paye User',
];

module.exports = class Ban extends Command {
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

		const message = banMessages[Math.floor(Math.random() * banMessages.length)].replace('User', user);
		logger.info(`User '${user.username}' banned with message : ${message}`);

		await interaction.reply(message);
		interaction.options.getMember('user').ban({ reason: 'Parce qu\'il le mérite' });
	}
};