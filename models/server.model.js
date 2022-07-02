const axios = require('axios');
const pool = require("../common/utils/db");

module.exports = {
    async getServers() {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM Server";
            const rows = await conn.query(sql);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async getServerById(id) {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM Server WHERE id=?";
            const rows = await conn.query(sql, id);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async addServer(serverId, name) {
        try {
            
            conn = await pool.getConnection();

            sql = "INSERT INTO Server (serverId, name) VALUES (?, ?);";
            const rows = await conn.query(sql, [serverId, name]);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
};