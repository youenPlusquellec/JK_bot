const path = require('path');
const fs = require('fs');
const vocabularyModel = require('./models/vocabulary.model');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

function csvToArray(str, jlpt, delimiter = ",") {

	const headers = str.slice(0, str.indexOf("\n")).replaceAll('\r', '').split(delimiter);

	const rows = str.slice(str.indexOf("\n") + 1).replaceAll('\r', '').split("\n");

	const arr = rows.map(function (row) {
		const values = row.split(delimiter);
		const el = headers.reduce(function (object, header, index) {
			object[header] = values[index];
			return object;
		}, {});
		el.jlpt = jlpt;
		return el;
	});

	// return the array
	return arr;
}

let buffer = fs.readFileSync(path.resolve(__dirname, 'JLPTN2Vocab.txt'));
const vocN2 = csvToArray(buffer.toString(), "2", '/');

buffer = fs.readFileSync(path.resolve(__dirname, 'JLPTN3Vocab.txt'));
const vocN3 = csvToArray(buffer.toString(), "3", '/');

buffer = fs.readFileSync(path.resolve(__dirname, 'JLPTN4Vocab.txt'));
const vocN4 = csvToArray(buffer.toString(), "4", '/');

buffer = fs.readFileSync(path.resolve(__dirname, 'JLPTN5Vocab.txt'));
const vocN5 = csvToArray(buffer.toString(), "5", '/');

async function manageData() {

	let commandN2 = `INSERT INTO vocabulary (vocabulary, reading, meanings, jlpt) VALUES `
	let commandN3 = `INSERT INTO vocabulary (vocabulary, reading, meanings, jlpt) VALUES `
	let commandN4 = `INSERT INTO vocabulary (vocabulary, reading, meanings, jlpt) VALUES `
	let commandN5 = `INSERT INTO vocabulary (vocabulary, reading, meanings, jlpt) VALUES `

	vocN2.forEach(voc => {
		if (voc.vocabulary == "") {
			console.log(voc)
		}
		commandN2 += `("${voc.vocabulary}", "${voc.reading}", '${JSON.stringify(voc.meanings.split(',')).replaceAll("'", "\\'").replaceAll("--", "")}', ${voc.jlpt}),`;
	});

	vocN3.forEach(voc => {
		commandN3 += `("${voc.vocabulary}", "${voc.reading}", '${JSON.stringify(voc.meanings.split(',')).replaceAll("'", "\\'").replaceAll("--", "")}', ${voc.jlpt}),`;
	});

	vocN4.forEach(voc => {
		commandN4 += `("${voc.vocabulary}", "${voc.reading}", '${JSON.stringify(voc.meanings.replaceAll(";", ",").split(',')).replaceAll("'", "\\'").replaceAll("--", "")}', ${voc.jlpt}),`;
	});

	vocN5.forEach(voc => {
		commandN5 += `("${voc.vocabulary}", "${voc.reading}", '${JSON.stringify(voc.meanings.split(',')).replaceAll("'", "\\'").replaceAll("--", "")}', ${voc.jlpt}),`;
	});

	try {
		fs.writeFileSync('N2.sql', commandN2);
		fs.writeFileSync('N3.sql', commandN3);
		fs.writeFileSync('N4.sql', commandN4);
		fs.writeFileSync('N5.sql', commandN5);
	} catch (err) {
		console.error(err);
	}
}

manageData();
