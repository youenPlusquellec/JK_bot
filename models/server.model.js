const pool = require("../common/utils/db");
let serverList = []

module.exports = {
    async getServers() {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM server";
            serverList = await conn.query(sql);

            conn.end();
            return serverList;
        } catch (err) {
            throw err;
        }
    },
    async getServerById(id) {
        try {
            conn = await pool.getConnection();
            
            const server = serverList.filter(
                function(data){ return data.id == id }
            );

            if (server.length) {
                conn.end();
                return server;
            } else {

                sql = "SELECT * FROM server WHERE id=?";
                const rows = await conn.query(sql, id);
                serverList.push(rows[0])

                conn.end();
                return rows;
            }
        } catch (err) {
            throw err;
        }
    },
    async getServerByServerId(id) {
        try {
            conn = await pool.getConnection();
            
            const server = serverList.filter(
                function(data){ return data.serverId == id }
            );

            if (server.length) {
                conn.end();
                return server;
            } else {

                sql = "SELECT * FROM server WHERE serverId=?";
                const rows = await conn.query(sql, id);
                serverList.push(rows[0])

                conn.end();
                return rows;
            }
        } catch (err) {
            throw err;
        }
    },
    async addServer(serverId, name) {
        try {
            
            conn = await pool.getConnection();

            sql = "INSERT INTO server (serverId, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id;";
            const rows = await conn.query(sql, [serverId, name]);
            serverList.push({id: Number(rows.insertId), serverId: serverId, name: name})

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
};