
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const usersModel = require("./user.model");

const KanjiRepository = require('./model/kanjiRepository');
const kanjiRepository = new KanjiRepository();


const kanjis = kanjiRepository.getKanjis()

kanjis.forEach(kanji => {
    console.log(kanji)

    const res = usersModel.addKanji(kanji)
    res.then(result => {
        console.log(result)
    })
})

