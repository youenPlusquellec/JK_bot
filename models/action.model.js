const pool = require("../common/utils/db");

module.exports = {
    async createAction(serverId, userId, type, cron, channelId, mentionRole) {
        try {
            conn = await pool.getConnection();

            sql = "INSERT INTO action (serverId, userId, type, cron, channelId, mentionRole) VALUES ((select id from server where serverId=?), (select id from user_account where userId=?), ?, ?, ?, ?)";
            const row = await conn.query(sql, [serverId, userId, type, cron, channelId, mentionRole ? mentionRole : null ]);

            conn.end();
            return row;
        } catch (err) {
            throw err;
        }
    },
    async getActions() {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM action";
            const rows = await conn.query(sql);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async getActionById(id) {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM action WHERE id=?";
            const rows = await conn.query(sql, id);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async getActionsByServerId(id) {
        try {
            conn = await pool.getConnection();

            sql = ` SELECT action.*
                    FROM action
                    INNER JOIN server ON action.serverId=server.id
                    WHERE server.serverId=?;`;
            const rows = await conn.query(sql, id);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async getActionsByServerIdAndChannelId(serverId, channelId) {
        try {
            conn = await pool.getConnection();

            sql = ` SELECT action.*
                    FROM action
                    INNER JOIN server ON action.serverId=server.id
                    WHERE server.serverId=? AND channelId=?`;
            const rows = await conn.query(sql, [serverId, channelId]);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async deleteActionByIdAndServerId(id, serverId) {
        try {
            const actions = await this.getActionsByServerId(serverId);
            if (id > actions.length - 1) throw "Given id is higher than actions length"
            
            conn = await pool.getConnection();

            sql = `DELETE FROM action WHERE id=?`;
            await conn.query(sql, actions[id].id);

            conn.end();
            return actions[id];
        } catch (err) {
            throw err;
        }
    },
    async deleteActionByIdAndServerIdAndChannelId(id, serverId, channelId) {
        try {
            const actions = await this.getActionsByServerIdAndChannelId(serverId, channelId);
            if (id > actions.length - 1) throw "Given id is higher than actions length"

            conn = await pool.getConnection();

            sql = `DELETE FROM action WHERE id=?`;
            await conn.query(sql, actions[id].id);

            conn.end();
            return actions[id];
        } catch (err) {
            throw err;
        }
    },
};