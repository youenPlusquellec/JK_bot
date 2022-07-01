pool = require("./mariadb");

module.exports = {
    async read(name) {
        try {
            conn = await pool.getConnection();
            sql = "SELECT id, name FROM USERS WHERE name = ?";
            const rows = await conn.query(sql, name);
            conn.end();
            if (rows.length == 1) {
                return rows[0];
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    },
    async readId(id) {
        try {
            conn = await pool.getConnection();
            sql = "SELECT id, name FROM USERS WHERE id = ?";
            const rows = await conn.query(sql, id);
            conn.end();
            if (rows.length == 1) {
                return rows[0];
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    },
    async list() {
        try {
            conn = await pool.getConnection();
            sql = "SELECT id, name FROM USERS";
            const rows = await conn.query(sql);
            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },

    async addKanji(kanji) {
        try {
            conn = await pool.getConnection();

            sql = "INSERT INTO Kanji (kanji) VALUES (?)";
            const insertedKanji = await conn.query(sql, kanji.kanji);

            if (!kanji.available) {
                sql = "INSERT INTO Used_kanji (kanjiId, serverId, used) VALUES (?, 1, true)";
                await conn.query(sql, insertedKanji.insertId);
            }

            conn.end();
            return insertedKanji;
        } catch (err) {
            throw err;
        }
    },
    async addAction(action) {
        try {
            conn = await pool.getConnection();

            sql = "INSERT INTO Action (serverId, userId, type, cron, channelId, mentionRole) VALUES (1, 1, ?, ?, ?, ?)";
            const insertedAction = await conn.query(sql, [action.type, action.cron, action.channel_id, action.mention_role ? action.mention_role : null ]);

            conn.end();
            return insertedAction;
        } catch (err) {
            throw err;
        }
    },
    async getHistory() {
        try {
            conn = await pool.getConnection();
            sql = "SELECT * FROM History";
            const rows = await conn.query(sql);
            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
}; 