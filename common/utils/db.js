const mariadb = require('mariadb');

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
		return new Promise(function(res, rej) {
			pool.getConnection()
				.then(function(conn) {
					res(conn);
				})
				.catch(function(error) {
					rej(error);
				});
		});
	},
};