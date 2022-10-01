const { UltimateTextToImage, registerFont } = require('ultimate-text-to-image');
const path = require('path');

const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {

	generateEmbedKanji: async function(embedColor, randKanji, guild) {

		// register font
		registerFont(path.join(__dirname, '../fonts/Aozora Mincho Medium.ttf'));
		registerFont(path.join(__dirname, '../fonts/irohamaru-mikami-Light.ttf'));
		registerFont(path.join(__dirname, '../fonts/irohamaru-mikami-Medium.ttf'));
		registerFont(path.join(__dirname, '../fonts/SourceHanSerif-Medium.otf'));

		new UltimateTextToImage(randKanji.kanji, {
			fontFamily: '源ノ明朝 Medium, Sans',
			fontColor: '#000000',
			fontSize: 390,
			minFontSize: 10,
			lineHeight: 50,
			autoWrapLineHeightMultiplier: 1.2,
			margin: 20,
			align: 'center',
			valign: 'middle',
			backgroundColor: 'F4E0C7',
		})
			.render()
			.toFile(path.resolve(process.env.KANJI_IMAGES_FOLDER, `${randKanji.id}.png`));


		// Security in case of changing type
		if (Array.isArray(randKanji.kunReadings)) {
			randKanji.kunReadings = JSON.stringify(randKanji.kunReadings);
		}
		if (Array.isArray(randKanji.onReadings)) {
			randKanji.onReadings = JSON.stringify(randKanji.onReadings);
		}
		if (Array.isArray(randKanji.meanings)) {
			randKanji.meanings = JSON.stringify(randKanji.meanings);
		}

		// It's creating an embed with the information about the kanji.
		const kanjiEmbed = new MessageEmbed()
			.setTitle(`**\`Le kanji du jour : ${randKanji.kanji}\`**`)
			.setURL(`https://jisho.org/search/${randKanji.kanji}%20%23kanji`)
			.setColor(embedColor)
			.setDescription(stripIndents`
					**📖 Lectures KUN :** ${JSON.parse(randKanji.kunReadings)}
		
					**📖 Lectures ON :** ${JSON.parse(randKanji.onReadings)}
		
					**📚 Sens :** ${JSON.parse(randKanji.meanings)}
		
					**💮 JLPT :** ${randKanji.jlpt ? randKanji.jlpt : 'Pas dans le JLPT'}
		
					À toi de jouer : écris un ou plusieurs mots **que tu connais** avec ce Kanji !
				`)
			.setImage(`attachment://${randKanji.id}.png`)
			.setFooter({ text: `${guild.name}`, iconURL: guild.iconURL() })
			.setTimestamp();

		// It's returning the embed to the function that called it.
		return kanjiEmbed;
	},
};
