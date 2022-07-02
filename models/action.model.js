const axios = require('axios');
const pool = require("../common/utils/db");

module.exports = {
    async createAction(serverId, userId, type, cron, channelId, mentionRole) {
        try {
            conn = await pool.getConnection();

            sql = "INSERT INTO Action (serverId, userId, type, cron, channelId, mentionRole) VALUES ((select id from server where serverId=?), (select id from User_account where userId=?), ?, ?, ?, ?)";
            const insertedAction = await conn.query(sql, [serverId, userId, type, cron, channelId, mentionRole ? mentionRole : null ]);

            conn.end();
            return insertedAction;
        } catch (err) {
            throw err;
        }
    },
    async getActions() {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM Action";
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

            sql = "SELECT * FROM Action WHERE id=?";
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

            sql = ` SELECT Action.*
                    FROM Action
                    INNER JOIN Server ON Action.serverId=Server.id
                    WHERE Server.serverId=?;`;
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

            sql = ` SELECT Action.*
                    FROM Action
                    INNER JOIN Server ON Action.serverId=Server.id
                    WHERE Server.serverId=? AND channelId=?`;
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

            sql = `DELETE FROM Action WHERE id=?`;
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

            sql = `DELETE FROM Action WHERE id=?`;
            await conn.query(sql, actions[id].id);

            conn.end();
            return actions[id];
        } catch (err) {
            throw err;
        }
    },
};