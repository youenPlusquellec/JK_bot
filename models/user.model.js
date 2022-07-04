const pool = require('../common/utils/db');

module.exports = {
	async getUsers() {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM user_account';
		const rows = await conn.query(sql);

		conn.end();
		return rows;
	},
	async getUserById(id) {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM user_account WHERE userId=?';
		const rows = await conn.query(sql, id);

		conn.end();
		return rows;
	},
	async addUser(userId, name) {
		const conn = await pool.getConnection();

		const sql = 'INSERT INTO user_account (userId, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id;';
		const rows = await conn.query(sql, [userId, name]);

		conn.end();
		return rows;
	},
};