const path = require('path');
const fs = require('fs');
const KanjiRepository = require('./model/kanjiRepository');
const kanjiRepository = new KanjiRepository();

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const buffer = fs.readFileSync(path.resolve(__dirname, 'out/kanji_to_update.txt'));
const kanjis_id = buffer.toString().slice(0, -1).split(',');

kanjis_id.forEach(id => {
	console.log(kanjiRepository.getKanjiById(+id));
	kanjiRepository.useKanjiById(+id);
});

fs.unlinkSync(path.resolve(__dirname, 'out/kanji_to_update.txt'));