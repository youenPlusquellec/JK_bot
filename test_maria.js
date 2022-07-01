
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const kanjiModel = require("./models/kanji.model");

const kanji = {"kanji":"心","grade":2,"stroke_count":4,"meanings":["heart","mind","spirit","heart radical (no. 61)"],"kun_readings":["こころ","-ごころ"],"on_readings":["シン"],"name_readings":[],"jlpt":3,"unicode":"5fc3","heisig_en":"heart"}

/*
const res = kanjiModel.getAvailableKanji('792912664262606848')
res.then(result => {
    console.log(result)
    console.log("----------")
    result.forEach(t => {
        console.log(t)
    })
})*/


const res = kanjiModel.getAvailableRandomKanji('792912664262606848')
res.then(result => {
    console.log(result)
})

/*
const res = kanjiModel.useKanji('体', '792912664262606848')
res.then(result => {
    console.log(result)
})
*/