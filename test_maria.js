
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const kanjiModel = require("./models/kanji.model");

const kanji = {"kanji":"心","grade":2,"stroke_count":4,"meanings":["heart","mind","spirit","heart radical (no. 61)"],"kun_readings":["こころ","-ごころ"],"on_readings":["シン"],"name_readings":[],"jlpt":3,"unicode":"5fc3","heisig_en":"heart"}

console.log(kanji.jlpt)

// Convert (js array) to (json object)
JsonObject = JSON.parse(JSON.stringify(kanji.meanings));

// type
console.log(typeof(JsonObject));

// JsonObject
console.log(JsonObject);

const res = kanjiModel.updateKanji(kanji.kanji, kanji.stroke_count, JSON.stringify(kanji.meanings), JSON.stringify(kanji.kun_readings), JSON.stringify(kanji.on_readings), kanji.jlpt)
res.then(result => {
    console.log(result)
})
