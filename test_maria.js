
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const kanjiModel = require("./models/kanji.model");
const actionModel = require("./models/action.model");
const serverModel = require("./models/server.model");

const res = serverModel.addServer('939187381351874691', 'Serveur')
res.then(result => {
    console.log(result)
})

const res2 = serverModel.addServer('939187381351874691', 'Serveur 2')
res2.then(result => {
    console.log(result)
})
