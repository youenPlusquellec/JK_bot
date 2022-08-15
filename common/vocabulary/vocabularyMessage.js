const { UltimateTextToImage, registerFont } = require('ultimate-text-to-image');
const path = require('path');

const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {

	generateEmbedVocabularies: async function (embedColor, vocN5, vocN4, vocN3) {

		// Security in case of changing type
		if (Array.isArray(vocN5.meanings)) {
			vocN5.meanings = JSON.stringify(vocN5.meanings);
		}
		if (Array.isArray(vocN4.meanings)) {
			vocN4.meanings = JSON.stringify(vocN4.meanings);
		}
		if (Array.isArray(vocN3.meanings)) {
			vocN3.meanings = JSON.stringify(vocN3.meanings);
		}

		// It's creating an embed with the information about the vocabulary.
		const vocabularyEmbed = new MessageEmbed()
			.setTitle(`**Exercice d'écriture**`)
			.setColor(embedColor)
			.setDescription(stripIndents`
					Nouvelle atelier écriture ! Créez une ou plusieurs phrases en utilisant au moins un des mots de vocabulaire ci-dessous.

					**📒 Mot : [${vocN5.vocabulary}](https://www.dictionnaire-japonais.com/search.php?w=${vocN5.vocabulary}&t=1)**　${vocN5.reading == vocN5.vocabulary ? '' : `(${vocN5.reading})`}
					**📖 Sens :** ${JSON.parse(vocN5.meanings)}
					**💮 JLPT :** N${vocN5.jlpt}

					**📒 Mot : [${vocN4.vocabulary}](https://www.dictionnaire-japonais.com/search.php?w=${vocN4.vocabulary}&t=1)**　${vocN4.reading == vocN4.vocabulary ? '' : `(${vocN4.reading})`}
					**📖 Sens :** ${JSON.parse(vocN4.meanings)}
					**💮 JLPT :** N${vocN4.jlpt}

					**📒 Mot : [${vocN3.vocabulary}](https://www.dictionnaire-japonais.com/search.php?w=${vocN4.vocabulary}&t=1)**　${vocN3.reading == vocN3.vocabulary ? '' : `(${vocN3.reading})`}
					**📖 Sens :** ${JSON.parse(vocN3.meanings)}
					**💮 JLPT :** N${vocN3.jlpt}

				`)
			.setThumbnail(`attachment://jk_logo.jpg`)
			.setTimestamp();

		// It's returning the embed to the function that called it.
		return vocabularyEmbed;
	},
};
