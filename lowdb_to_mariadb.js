const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const kanjiModel = require("./models/kanji.model");
const actionModel = require("./models/action.model");

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
    const res = actionModel.addAction('792912664262606848', '191879625972908032', action.type, action.cron, action.channel_id, action.mention_role)
    res.then(result => {
        console.log(result)
    })
})
