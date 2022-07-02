const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const kanjiModel = require("./models/kanji.model");
const actionModel = require("./models/action.model");

const KanjiRepository = require('./deprecated/model/kanjiRepository');
const kanjiRepository = new KanjiRepository();
const ActionRepository = require('./deprecated/model/actionRepository');
const actionRepository = new ActionRepository();

async function manageData() {

    const kanjis = kanjiRepository.getKanjis()
    for (let i=0; i<kanjis.length; i++) {
        const res = await kanjiModel.addKanji(kanjis[i].kanji, kanjis[i].available)
        console.log(res)
    }
    
    const actions = actionRepository.getActions()
    for (let i=0; i<actions.length; i++) {
        const res = actionModel.createAction('792912664262606848', '191879625972908032', actions[i].type, actions[i].cron, actions[i].channel_id, actions[i].mention_role)
        console.log(res)
    }
}

manageData();