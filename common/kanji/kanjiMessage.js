const { UltimateTextToImage, registerFont } = require('ultimate-text-to-image');
const path = require('path');

const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {

	generateEmbedKanji: async function(embedColor, randKanji) {

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

		console.log(typeof(randKanji.kunReadings))
		console.log(typeof(JSON.stringify(randKanji.kunReadings)))
		console.log(JSON.parse(JSON.stringify(randKanji.kunReadings)))

		// It's creating an embed with the information about the kanji.
		const kanjiEmbed = new MessageEmbed()
			.setTitle(`**\`Le kanji du jour : ${randKanji.kanji}\`**`)
			.setURL(`https://jisho.org/search/${randKanji.kanji}%20%23kanji`)
			.setColor(embedColor)
			.setDescription(stripIndents`
					**✍️ Lectures KUN:** ${JSON.parse(JSON.stringify(randKanji.kunReadings))}
		
					**✍️ Lectures ON:** ${JSON.parse(JSON.stringify(randKanji.onReadings))}
		
					**📚 Sens (anglais):** ${JSON.parse(JSON.stringify(randKanji.meanings))}
		
					**🎓 JLPT:** ${randKanji.jlpt ? randKanji.jlpt : 'Pas dans le JLPT'}
		
					À toi de jouer : écris un ou plusieurs mots avec ce Kanji !
				`)
			.setImage(`attachment://${randKanji.id}.png`)
			.setTimestamp();

		// It's returning the embed to the function that called it.
		return kanjiEmbed;
	},
};
