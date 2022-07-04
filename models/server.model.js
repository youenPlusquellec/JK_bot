const pool = require('../common/utils/db');
let serverList = [];

module.exports = {
    async getServers() {
        const conn = await pool.getConnection();

        const sql = 'SELECT * FROM server';
        serverList = await conn.query(sql);

        conn.end();
        return serverList;
    },
    async getServerById(id) {
        const conn = await pool.getConnection();

        const server = serverList.filter(
            function (data) { return data.id == id; },
        );

        if (server.length) {
            conn.end();
            return server;
        } else {
            const sql = 'SELECT * FROM server WHERE id=?';
            const rows = await conn.query(sql, id);
            if (rows[0]) {
                serverList.push(rows[0])
            }

            conn.end();
            return rows;
        }
    },
    async getServerByServerId(id) {
        const conn = await pool.getConnection();

        const server = serverList.filter(
            function (data) { return data.serverId == id; },
        );

        if (server.length) {
            conn.end();
            return server;
        } else {

            const sql = 'SELECT * FROM server WHERE serverId=?';
            const rows = await conn.query(sql, id);
            if (rows[0]) {
                serverList.push(rows[0])
            }

            conn.end();
            return rows;
        }
    },
    async addServer(serverId, name) {
        const conn = await pool.getConnection();

        const sql = 'INSERT INTO server (serverId, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id;';
        const rows = await conn.query(sql, [serverId, name]);
        serverList.push({ id: Number(rows.insertId), serverId: serverId, name: name });

        conn.end();
        return rows;
    },
};