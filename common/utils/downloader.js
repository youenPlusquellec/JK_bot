'use strict';

const axios = require('axios');
const fs = require('fs');

async function downloadFile(fileUrl, outputLocationPath) {
	const writer = fs.createWriteStream(outputLocationPath);

	const response = await axios({
		method: 'get',
		url: fileUrl,
		responseType: 'stream',
	});

	return await new Promise((resolve, reject) => {
		response.data.pipe(writer);
		let error = null;
		writer.on('error', err => {
			error = err;
			writer.close();
			reject(err);
		});
		writer.on('close', () => {
			if (!error) {
				resolve(true);
			}
		});
	});
}

module.exports = {
	downloadFile,
};
