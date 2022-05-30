const kyouiku = require('./every_kyouiku.json');
const axios = require('axios');

module.exports = {

    get_random_kanji: function () {
        
        length = Object.keys(kyouiku).length

        let random;

        do {
            id = Math.floor(Math.random() * kyouiku.kanjis.length);
            random = kyouiku.kanjis[id];
        } while (random.active == true)

        console.log("je vais retrourner ça :")
        console.log(random)

        return random;
    },

    get_kanji_info: async function (kanji) {
        console.log(kanji)
        const path = encodeURI("https://kanjiapi.dev/v1/kanji/"+kanji); 
        const res = await axios.get(path);
        console.log(res.data)
        return res.data;
    }
}