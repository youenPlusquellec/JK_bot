'use strict';

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'DEBUG';

function debug(msg) {
	logger.debug(msg);
}

function info(msg) {
	logger.info(msg);
}

function warn(msg) {
	logger.warn(msg);
}

function error(msg) {
	logger.error(msg);
}

module.exports = {
	debug,
	info,
	warn,
	error,
};
