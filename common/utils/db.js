const mariadb = require('mariadb');
const cron = require('cron');
const mysqlBackup = require('../../mysqlBackupackup');
const config = require('../../config');

const pool = mariadb.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	socketPath: process.env.DB_SOCKET_PATH ? process.env.DB_SOCKET_PATH : undefined,
	acquireTimeout: 1000000,
});

module.exports = {
	getConnection() {
		return new Promise(function (res, rej) {
			pool.getConnection()
				.then(function (conn) {

					// Schedule dump of the db
					if (config.dumpCronTab) {
						global.cronDump = new cron.CronJob(config.dumpCronTab, async () => {
							mysqlBackup(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE)
						});
						global.cronDump.start();
					}

					res(conn);
				})
				.catch(function (error) {
					rej(error);
				});
		});
	},
};