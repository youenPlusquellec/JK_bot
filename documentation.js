const fs = require('fs');
const ejs = require("ejs");
const path = require('path');

function ejs2html(path, information) {

    fs.readFile(`${path}.ejs`, 'utf8', function (err, data) {

        if (err) {
            console.log(err);
            return false;
        }

        const ejs_string = data;
        const template = ejs.compile(ejs_string);
        const html = template(information);

        fs.writeFile(`${path}.html`, html, function (err) {
            if (err) { 
                console.log(err); 
                return false 
            }
            return true;
        });
    });
}

ejs2html(path.join(__dirname, 'documentation/doc'), {coucou: "bite"})