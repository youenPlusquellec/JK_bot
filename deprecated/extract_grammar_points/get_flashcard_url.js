const axios = require('axios');
const fs = require('fs');
const grammar = require('../../voila.json')
const url = require('../../url.json')

function isPresentInJson(json, id) {
    for (i = 0; i < json.length; i++) {
        if (json[i].id == id)
            return true;
    }
    return false;
}

function missingInJson(json) {
    let missing = 0;
    for (i = 0; i < json.length; i++) {
        if (!json[i].url.startsWith("https://jlptsensei.com/wp-content/uploads/"))
            console.log("OH NON ! "+json[i].id)
        if (json[i].url == "missing")
            ++missing;
    }
    return missing;
}

async function voila() {

    storageJson = []
    grammarsJson = grammar

    for (let i = 28; i < grammarsJson.length; i++) {
        const point = grammarsJson[i]
        const urlPoint = url[i];
        const english = point.english[0].replaceAll(' ', '-').replaceAll('/', '-').replaceAll('~', '')
        const hiragana = point.japanese[0].replaceAll("（", '-').replaceAll('/', '-').replace("）", '')
        const jlpt = point.jlpt

        let ok = false;
        //console.log(point)
        //console.log(urlPoint)
        if (urlPoint.url === "missing") {
            for (let year = 2022; year > 2014; year--) {
                for (let month = 0; month < 13; month++) {
                    if (!ok) {
                        console.log(`${point.id} : ${year}-${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`)
                        console.log(`https://jlptsensei.com/wp-content/uploads/${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/${english}-${hiragana}-jlpt-n${jlpt}-grammar-meaning-文法-例文-japanese-flashcards-600x338.png`)
                        await axios({
                            method: 'get',
                            url: `https://jlptsensei.com/wp-content/uploads/${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/${english}-${encodeURIComponent(hiragana)}-jlpt-n${jlpt}-grammar-meaning-%E6%96%87%E6%B3%95-%E4%BE%8B%E6%96%87-japanese-flashcards-600x338.png`,
                            timeout: 600
                        })
                            .then(function (response) {
                                //response.data.pipe(fs.createWriteStream(`out/${point.id}.jpg`))
                                ok = true;
                                //if (!isPresentInJson(storageJson, point.id)) {
                                    url[i].url = `https://jlptsensei.com/wp-content/uploads/${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/${english}-${encodeURIComponent(hiragana)}-jlpt-n${jlpt}-grammar-meaning-%E6%96%87%E6%B3%95-%E4%BE%8B%E6%96%87-japanese-flashcards-600x338.png`;
                                    /*storageJson.push({
                                        id: point.id,
                                        url: `https://jlptsensei.com/wp-content/uploads/${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/${english}-${encodeURIComponent(hiragana)}-jlpt-n${jlpt}-grammar-meaning-%E6%96%87%E6%B3%95-%E4%BE%8B%E6%96%87-japanese-flashcards-600x338.png`
                                    })*/
                                    console.log(`ok for /${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/!`)
                                //}
                            })
                            .catch(async function (error) {
                                /*await axios({
                                    method: 'get',
                                    url: `https://jlptsensei.com/wp-content/uploads/${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/${english}-${encodeURIComponent(hiragana)}-${encodeURIComponent(hiragana)}-jlpt-n${jlpt}-grammar-meaning-%E6%96%87%E6%B3%95-%E4%BE%8B%E6%96%87-japanese-flashcards-600x338.png`,
                                    timeout: 500
                                })
                                    .then(function (response) {
                                        //response.data.pipe(fs.createWriteStream(`out/${point.id}.jpg`))
                                        ok = true;
                                        //if (!isPresentInJson(storageJson, point.id)) {
                                            url[i].url = `https://jlptsensei.com/wp-content/uploads/${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/${english}-${encodeURIComponent(hiragana)}-${encodeURIComponent(hiragana)}-jlpt-n${jlpt}-grammar-meaning-%E6%96%87%E6%B3%95-%E4%BE%8B%E6%96%87-japanese-flashcards-600x338.png`;
                                            /*storageJson.push({
                                                id: point.id,
                                                url: `https://jlptsensei.com/wp-content/uploads/${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/${english}-${encodeURIComponent(hiragana)}-${encodeURIComponent(hiragana)}-jlpt-n${jlpt}-grammar-meaning-%E6%96%87%E6%B3%95-%E4%BE%8B%E6%96%87-japanese-flashcards-600x338.png`
                                            })*/
                                            /*console.log(`ok for /${year}/${month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}/ x 2 hiragana !`)
                                        //}
                                    })
                                    .catch(function (error) {
                                        //console.log("not a valid url")
                                    });*/
                            });

                    }
                }
            }
            if (!ok) {
                console.log("Missing " + point.id + ` for https://jlptsensei.com/wp-content/uploads/year/month/${english}-${encodeURIComponent(hiragana)}-${encodeURIComponent(hiragana)}-jlpt-n${jlpt}-grammar-meaning-%E6%96%87%E6%B3%95-%E4%BE%8B%E6%96%87-japanese-flashcards-600x338.png`)
                /*storageJson.push({
                    id: point.id,
                    url: `missing`
                })*/
            }
        } else {
            console.log("Skip n°"+point.id)
        }

        fs.writeFile('url2.json', JSON.stringify(url), err => {
            if (err) {
                console.error(err);
            }
            // file written successfully
        });
    }
    //const url = "https://jlptsensei.com/wp-content/uploads/2018/08/ba-ば-ば-jlpt-n4-grammar-meaning-文法-例文-japanese-flashcards-600x338.png"
    //console.log(encodeURIComponent('ば'))

    /*
    axios({
        method: 'get',
        url: 'https://jlptsensei.com/wp-content/uploads/2018/08/ba-%E3%81%B0-%E3%81%B0-jlpt-n4-grammar-meaning-%E6%96%87%E6%B3%95-%E4%BE%8B%E6%96%87-japanese-flashcards-600x338.png',
        responseType: 'stream'
    })
        .then(function (response) {
            response.data.pipe(fs.createWriteStream('ada_lovelace2.jpg'))
        })
        .catch(function (error) {
            console.log("not a valid url")
        });
    */
    /*
    for (let i = 0; i < grammar.length; i++) {
        console.log(grammar[i])
    }
    */
}

console.log(missingInJson(url))
//voila();