const urls = require('./url.json')
const fs = require('fs')

let sql = ""

for (var i = 0; i < urls.length; i++) {
    const value = urls[i];

    sql += `UPDATE grammar_point SET flashcard='${value.url}' WHERE id=${value.id};`;
}
fs.writeFile('url.sql', JSON.stringify(sql), err => {
    if (err) {
        console.error(err);
    }
    // file written successfully
});
console.log(sql)