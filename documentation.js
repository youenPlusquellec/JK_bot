const fs = require('fs');
const ejs = require('ejs');
const pathLib = require('path');
const logger = require('./common/utils/logger');

function ejs2html(path, information) {

	fs.readFile(`${path}.ejs`, 'utf8', function(err, data) {

		if (err) {
			logger.error(err);
			return false;
		}

		const ejs_string = data;
		const template = ejs.compile(ejs_string);
		const html = template(information);

		fs.writeFile(`${path}.html`, html, function(err) {
			if (err) {
				logger.error(err);
				return false;
			}
			return true;
		});
	});
}

ejs2html(pathLib.join(__dirname, 'documentation/doc'), { coucou: 'bite' });