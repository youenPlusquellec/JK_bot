
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const usersModel = require("./user.model");

const KanjiRepository = require('./model/kanjiRepository');
const kanjiRepository = new KanjiRepository();
const ActionRepository = require('./model/actionRepository');
const actionRepository = new ActionRepository();


const kanjis = kanjiRepository.getKanjis()

kanjis.forEach(kanji => {
    console.log(kanji)

    const res = usersModel.addKanji(kanji)
    res.then(result => {
        console.log(result)
    })
})

const actions = actionRepository.getActions()
actions.forEach(action => {
    console.log(action)

    const res = usersModel.addAction(action)
    res.then(result => {
        console.log(result)
    })
})
