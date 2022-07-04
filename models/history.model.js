const pool = require('../common/utils/db');

module.exports = {
	async getHistory() {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM history';
		const rows = await conn.query(sql);

		conn.end();
		return rows;
	},
	async addToHistory(type, userId, serverId) {
		const conn = await pool.getConnection();

		const sql = 'INSERT INTO history (userId, serverId, type) VALUES ((SELECT id FROM user_account WHERE userId=?), (SELECT id FROM server WHERE serverId=?), ?);';
		const rows = await conn.query(sql, [userId, serverId, type]);

		conn.end();
		return rows;
	},
};