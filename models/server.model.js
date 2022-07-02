const pool = require("../common/utils/db");
let serverList = []

module.exports = {
    async getServers() {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM Server";
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

                sql = "SELECT * FROM Server WHERE id=?";
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

                sql = "SELECT * FROM Server WHERE serverId=?";
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

            sql = "INSERT INTO Server (serverId, name) VALUES (?, ?);";
            const rows = await conn.query(sql, [serverId, name]);
            serverList.push({id: rows.insertId, serverId: serverId, name: name})

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
};