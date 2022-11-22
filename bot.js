const Client = require('./structures/Client');
const path = require('path');
const logrotate = require('logrotator');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const client = new Client();
client.login();

const rotator = logrotate.rotator;

rotator.register('./myfile.log', {
	schedule: '1m',
	size: '10k',
	compress: false,
	count: 10,
	format: function (index) {
		var d = new Date();
		return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
	}
});

rotator.on('error', function (err) {
	console.log('oops, an error occured!');
});

// 'rotate' event is invoked whenever a registered file gets rotated
rotator.on('rotate', function (file) {
	console.log('file ' + file + ' was rotated!');
});


process.on('uncaughtException', err => console.error(err.stack));
process.on('unhandledRejection', err => console.error(err.stack));
process.on('SIGINT', function () {

	// Stop every scheduled tasks
	if (global.cronTasks) {
		for (const [key, value] of global.cronTasks) {
			value.stop();
			global.cronTasks.delete(key);
		}
	}

	// Stop dump scheduled task
	if (global.cronDump) {
		global.cronDump.stop();
	}

	process.exit();
});