const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const path = require('path');
const downloader = require('../../common/utils/downloader');

module.exports = {

	generateEmbedGrammar: async function (embedColor, grammarPoint) {

		// Security in case of changing type
		if (Array.isArray(grammarPoint.japanese)) {
			grammarPoint.japanese = JSON.stringify(grammarPoint.japanese);
		}
		if (Array.isArray(grammarPoint.english)) {
			grammarPoint.english = JSON.stringify(grammarPoint.english);
		}
		if (Array.isArray(grammarPoint.grammar)) {
			grammarPoint.grammar = JSON.stringify(grammarPoint.grammar);
		}

		await downloader.downloadFile(
			grammarPoint.flashcard,
			path.resolve(process.env.KANJI_IMAGES_FOLDER, `grammar_${grammarPoint.id}.png`)
		)

		// It's creating an embed with the information about the vocabulary.
		const grammarEmbed = new MessageEmbed()
			.setTitle(`**Exercice de grammaire**`)
			.setColor(embedColor)
			.setDescription(stripIndents`
					Lien vers la leçon : [ici](${grammarPoint.url})
		
					À toi de jouer : écris une ou plusieurs phrases à l'aide de ce point de grammaire !
				`)
			.setImage(`attachment://grammar_${grammarPoint.id}.png`)
			.setTimestamp()
			.setFooter({ text: 'Tiré de JLPT Sensei' });

		// It's returning the embed to the function that called it.
		return grammarEmbed;
	},
};
