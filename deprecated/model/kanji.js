'use strict';

module.exports = class Kanji {
	constructor(id, kanji, available) {
		this.id = id;
		this.kanji = kanji;
		this.available = available;
	}
};
