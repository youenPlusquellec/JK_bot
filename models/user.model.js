const pool = require("../common/utils/db");

module.exports = {
    async getUsers() {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM user_account";
            const rows = await conn.query(sql);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async getUserById(id) {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM user_account WHERE userId=?";
            const rows = await conn.query(sql, id);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async addUser(userId, name) {
        try {
            
            conn = await pool.getConnection();

            sql = "INSERT INTO user_account (userId, name) VALUES (?, ?);";
            const rows = await conn.query(sql, [userId, name]);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
};