
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const kanjiModel = require("./models/kanji.model");
const actionModel = require("./models/action.model");

const kanji = {"kanji":"心","grade":2,"stroke_count":4,"meanings":["heart","mind","spirit","heart radical (no. 61)"],"kun_readings":["こころ","-ごころ"],"on_readings":["シン"],"name_readings":[],"jlpt":3,"unicode":"5fc3","heisig_en":"heart"}
const action = {
    "id": "e3ecbc88-22d6-46fe-995b-cce069d61a41",
    "type": "test",
    "cron": "2 0 0 1 1 1",
    "serverId": "939187381351874691",
    "channelId": "973686786196918302",
    "mentionRole": null
  }

const res = actionModel.createAction('792912664262606848', '191879625972908032', action.type, action.cron, action.channelId, action.mentionRole)
res.then(t => {
    console.log(t)
})

//const res = migrationModel.addKanji("個", false)
/*res.then(result => {
    console.log(result)
})*/

/*
const res = kanjiModel.getAvailableKanji('792912664262606848')
res.then(result => {
    console.log(result)
    console.log("----------")
    result.forEach(t => {
        console.log(t)
    })
})*/

/*
const res = kanjiModel.getAvailableRandomKanji('792912664262606848')
res.then(result => {
    console.log(result)
})*/

/*
const res = kanjiModel.useKanji('体', '792912664262606848')
res.then(result => {
    console.log(result)
})
*/