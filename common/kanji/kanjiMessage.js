const { UltimateTextToImage, registerFont } = require('ultimate-text-to-image');
const logger = require('../utils/logger');
const config = require('../../config');
const path = require("path");
const fs = require('fs');

const { MessageEmbed, MessageAttachment } = require('discord.js');
const { stripIndents } = require('common-tags');
const kanjiModel = require("../../models/kanji.model");

module.exports = {

	generateEmbedKanji: async function (client, serverId) {

		// It's getting a random kanji from a JSON file and getting the information about it.
		let randKanji = await kanjiModel.getAvailableRandomKanji(serverId)
		if (randKanji == null) {
			throw "Plus aucun kanji n'est disponible"
		}

		// register font
		registerFont(path.join(__dirname, `../fonts/Aozora Mincho Medium.ttf`));
		registerFont(path.join(__dirname, `../fonts/irohamaru-mikami-Light.ttf`));
		registerFont(path.join(__dirname, `../fonts/irohamaru-mikami-Medium.ttf`));
		registerFont(path.join(__dirname, `../fonts/SourceHanSerif-Medium.otf`));

		new UltimateTextToImage(randKanji.kanji, {
			fontFamily: "源ノ明朝 Medium, Sans",
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
		.toFile(path.join(__dirname, `../../out/${randKanji.id}.png`));

		// It's creating an embed with the information about the kanji.
		const kanjiEmbed = new MessageEmbed()
			.setTitle(`**\`Le kanji du jour : ${randKanji.kanji}\`**`)
			.setURL(`https://jisho.org/search/${randKanji.kanji}%20%23kanji`)
			.setColor(client.config.embedColor)
			.setDescription(stripIndents`
					**✍️ Lectures KUN:** ${randKanji.kunReadings}
		
					**✍️ Lectures ON:** ${randKanji.onReadings}
		
					**📚 Sens (anglais):** ${randKanji.meanings}
		
					**🎓 JLPT:** ${randKanji.jlpt ? randKanji.jlpt : "Pas dans le JLPT"}
		
					À toi de jouer : écris un ou plusieurs mots avec ce Kanji !
				`)
			.setImage(`attachment://${randKanji.id}.png`)
			.setTimestamp();

		// It's returning the embed to the function that called it.
		return [kanjiEmbed, randKanji.id];
	}
}
