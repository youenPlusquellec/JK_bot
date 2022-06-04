const KanjiRepository = require('../model/kanjiRepository');
const kanjiRepository = new KanjiRepository();

const textToImage = require('text-to-image');
const logger = require('../common/utils/logger');
const config = require('../config');

const { MessageEmbed, MessageAttachment } = require('discord.js');
const { stripIndents } = require('common-tags');

const ActionRepository = require('../model/actionRepository');
const actionRepository = new ActionRepository();

module.exports = {

	generateEmbedKanji: async function(client, role) {

		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		// It's getting a random kanji from a JSON file and getting the information about it.
		let randKanji = kanjiRepository.getAvailableRandomKanji()

        // It's getting the information about the kanji from a JSON file.
		let kInfo = await kanjiRepository.getKanjiInfo(randKanji.kanji);
		logger.debug("Random Kanji found : " + randKanji.kanji);

		// It's generating an image from the kanji.
		const dataUri = await textToImage.generate(randKanji.kanji, {
			fontSize: config.font_size,
			margin: 5,
			bgColor: '#F4E0C7',
			textColor: 'black',
			verticalAlign: 'center',
			fontFamily: 'Sans'
		});

		// It's saving the image to a file.
		var base64Data = dataUri.replace(/^data:image\/png;base64,/, "");
		require("fs").writeFile("out.png", base64Data, 'base64', function (err) {
			if (err) logger.error(`write file error: ${err}`);
		});

		// It's creating an embed with the information about the kanji.
		const kanjiEmbed = new MessageEmbed()
			.setTitle(`**\`Le kanji du jour : ${kInfo.kanji}\`**`)
			.setURL(`https://jisho.org/search/${kInfo.kanji}%20%23kanji`)
			.setColor(client.config.embedColor)
			.setDescription(stripIndents`
					**✍️ Lectures KUN:** ${kInfo.kun_readings}
		
					**✍️ Lectures ON:** ${kInfo.on_readings}
		
					**📚 Sens (anglais):** ${kInfo.meanings}
		
					**🎓 JLPT:** ${kInfo.jlpt ? kInfo.jlpt : "Pas dans le JLPT"}
		
					À toi de jouer : écris un ou plusieurs mots avec ce Kanji !
				`)
			.setImage('attachment://out.png')
			.setTimestamp();

		// Set the kanji as used in the JSON file.
		kanjiRepository.useKanjiById(randKanji.id)

		// It's returning the embed to the function that called it.
		return kanjiEmbed;
	}
}