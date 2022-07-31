'use strict';

const mysqldump = require('mysqldump');
const fs = require('fs');
const moment = require('moment');
const logger = require('./common/utils/logger');

const mysqlBackup = function (host, user, password, database) {

	// Creates "dumps" folder if does not exist
	if (!fs.existsSync('database/dumps')) {
		fs.mkdirSync('database/dumps');
		logger.info("Creating database/dumps folder")
	}

	// Dump and save database
	mysqldump({
		connection: {
			host: host,
			user: user,
			password: password,
			database: database,
		},
		dumpToFile: 'database/dumps/mysql-backup-' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.sql',
	});

	// Debug
	logger.info("Generated database dump");
};

module.exports = mysqlBackup;