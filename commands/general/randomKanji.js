const Command = require('../../structures/CommandClass');
const textToImage = require('text-to-image');

const { MessageEmbed, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');
const { get_random_kanji, get_kanji_info } = require("../../kanji/import_json")

module.exports = class RandomKanji extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('rkanji')
				.setDescription('Renvoie un kanji aléatoire'),
			usage: 'rkanji',
			category: 'kanji',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}

	async run(client, interaction) {

		/* It's getting a random kanji from a JSON file and getting the information about it. */
		let randKanji = get_random_kanji()
		let kInfo = await get_kanji_info(randKanji.kanji);
		console.log("Random Kanji found : " + randKanji);

		/* It's a way to send a message to the user without sending it right away. */
		await interaction.deferReply();

		/* It's generating an image from the kanji. */
		const dataUri = await textToImage.generate(randKanji.kanji, {
			fontSize: 395,
			margin: 5,
			bgColor: '#F4E0C7',
			textColor: 'black',
			verticalAlign: 'center'
		});

		/* It's saving the image to a file. */
		var base64Data = dataUri.replace(/^data:image\/png;base64,/, "");
		require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
			console.log(`write file error: ${err}`);
		});

		/* It's creating an embed with the information about the kanji. */
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

		/* It's sending the message to the user. */
		return await interaction.followUp({ embeds: [kanjiEmbed], files: ['./out.png'] });
	}
};