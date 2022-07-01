
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const migrationModel = require("./migration.model");
const kanjiModel = require("./models/kanji.model");

const KanjiRepository = require('./deprecated/model/kanjiRepository');
const kanjiRepository = new KanjiRepository();
const ActionRepository = require('./deprecated/model/actionRepository');
const actionRepository = new ActionRepository();
const kanjis = kanjiRepository.getKanjis()


kanjis.forEach(kanji => {
    const res = kanjiModel.addKanji(kanji.kanji, kanji.available)
    res.then(result => {
        console.log(result)
    })
})

const actions = actionRepository.getActions()
actions.forEach(action => {
    console.log(action)

    const res = migrationModel.addAction(action)
    res.then(result => {
        console.log(result)
    })
})
