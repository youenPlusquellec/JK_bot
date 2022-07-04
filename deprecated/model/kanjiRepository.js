'use strict';

const Kanji = require('./kanji');
const axios = require('axios');
const Db = require('../common/db');
const db = new Db();

module.exports = class KanjiRepository {
	createKanji(id, kanji, available) {
		const _kanji = new Kanji(id, kanji, available);
		db.insert('kanjis', _kanji);
	}

	getKanjis() {
		return db.getAll('kanjis');
	}

	getAvailableKanjis() {
		const kanjisList = db.getAllBy(
			'kanjis',
			(kanji) => kanji.available === true,
		);
		return kanjisList;
	}

	getKanjiById(id) {
		const kanji = db.getBy('kanjis', { id });
		return kanji;
	}

	useKanjiById(id) {
		db.update('kanjis', { id }, { available: false });
	}

	getAvailableRandomKanji() {
		const availableKanjis = this.getAvailableKanjis();
		const length = availableKanjis.length;

		return availableKanjis[Math.floor(Math.random() * length)];
	}

	async getKanjiInfo(kanji) {
		const path = encodeURI(`https://kanjiapi.dev/v1/kanji/${kanji}`);
		const res = await axios.get(path);
		return res.data;
	}
};
