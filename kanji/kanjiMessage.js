const KanjiRepository = require('../model/kanjiRepository');
const kanjiRepository = new KanjiRepository();

const { UltimateTextToImage, registerFont } = require('ultimate-text-to-image');
const logger = require('../common/utils/logger');
const config = require('../config');
const path = require("path");
const fs = require('fs');

const { MessageEmbed, MessageAttachment } = require('discord.js');
const { stripIndents } = require('common-tags');

const ActionRepository = require('../model/actionRepository');
const actionRepository = new ActionRepository();

module.exports = {

	generateEmbedKanji: async function (client, role) {

		// It's getting a random kanji from a JSON file and getting the information about it.
		let randKanji = kanjiRepository.getAvailableRandomKanji()

		// It's getting the information about the kanji from a JSON file.
		let kInfo = await kanjiRepository.getKanjiInfo(randKanji.kanji);
		logger.info(`Generated Kanji : ${randKanji.kanji}`);

		// register font
		registerFont(path.join(__dirname, `fonts/Aozora Mincho Medium.ttf`));
		registerFont(path.join(__dirname, `fonts/irohamaru-mikami-Light.ttf`));
		registerFont(path.join(__dirname, `fonts/irohamaru-mikami-Medium.ttf`));
		registerFont(path.join(__dirname, `fonts/SourceHanSerif-Medium.otf`));

		new UltimateTextToImage(randKanji.kanji, {
			//fontFamily: "あおぞら明朝 Medium, Sans",
			//fontFamily: "いろはマルみかみ Light, Sans",
			fontFamily: "いろはマルみかみ Medium, Sans",
			//fontFamily: "いろはマルみかみ Regular, Sans",
			//fontFamily: "源ノ明朝 Medium, Sans",
			fontColor: "#000000",
			fontSize: 390,
			minFontSize: 10,
			lineHeight: 50,
			autoWrapLineHeightMultiplier: 1.2,
			margin: 20,
			align: "center",
			valign: "middle",
			backgroundColor: "F4E0C7",
		})
			.render()
			.toFile(path.join(__dirname, `../out/${randKanji.id}.png`));

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
			.setImage(`attachment://${randKanji.id}.png`)
			.setTimestamp();

		// Set the kanji as used in the JSON file.
		//kanjiRepository.useKanjiById(randKanji.id)
		fs.appendFile(path.join(__dirname, `../out/kanji_to_update.txt`), `${randKanji.id},`, function (err) {
			if (err) throw err;
			logger.debug(`kanji_to_update.txt updated with ${randKanji.kanji}`);
		});

		// It's returning the embed to the function that called it.
		return [kanjiEmbed, randKanji.id];
	}
}