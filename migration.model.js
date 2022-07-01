pool = require("./common/utils/db");

module.exports = {
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