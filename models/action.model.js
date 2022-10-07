const pool = require('../common/utils/db');

module.exports = {
	async createAction(serverId, userId, type, cron, channelId, mentionRole, parameters = null) {
		const conn = await pool.getConnection();

		const sql = 'INSERT INTO action (serverId, userId, type, cron, channelId, mentionRole, parameters) VALUES ((select id from server where serverId=?), (select id from user_account where userId=?), ?, ?, ?, ?, ?)';
		const row = await conn.query(sql, [
			serverId,
			userId,
			type,
			cron,
			channelId,
			mentionRole ? mentionRole : null,
			JSON.stringify(parameters),
		]);

		conn.end();
		return row;
	},
	async getActions() {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM action';
		const rows = await conn.query(sql);

		conn.end();
		return rows;
	},
	async getActionById(id) {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM action WHERE id=?';
		const rows = await conn.query(sql, id);

		conn.end();
		return rows;
	},
	async getActionsByServerId(id) {
		const conn = await pool.getConnection();

		const sql = ` SELECT action.*
                    FROM action
                    INNER JOIN server ON action.serverId=server.id
                    WHERE server.serverId=?;`;
		const rows = await conn.query(sql, id);

		conn.end();
		return rows;
	},
	async getActionsByServerIdAndChannelId(serverId, channelId) {
		const conn = await pool.getConnection();

		const sql = ` SELECT action.*
                    FROM action
                    INNER JOIN server ON action.serverId=server.id
                    WHERE server.serverId=? AND channelId=?`;
		const rows = await conn.query(sql, [serverId, channelId]);

		conn.end();
		return rows;
	},
	async deleteActionById(id) {
		const conn = await pool.getConnection();

		const sql = 'DELETE FROM action WHERE id=?';
		await conn.query(sql, id);

		conn.end();
	},
	async deleteActionByIdAndServerId(id, serverId) {
		const actions = await this.getActionsByServerId(serverId);
		if (id > actions.length - 1) throw 'Given id is higher than actions length';

		const conn = await pool.getConnection();

		const sql = 'DELETE FROM action WHERE id=?';
		await conn.query(sql, actions[id].id);

		conn.end();
		return actions[id];
	},
	async deleteActionByIdAndServerIdAndChannelId(id, serverId, channelId) {
		const actions = await this.getActionsByServerIdAndChannelId(serverId, channelId);
		if (id > actions.length - 1) throw 'Given id is higher than actions length';

		const conn = await pool.getConnection();

		const sql = 'DELETE FROM action WHERE id=?';
		await conn.query(sql, actions[id].id);

		conn.end();
		return actions[id];
	},
};