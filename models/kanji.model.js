pool = require("../common/utils/db");

module.exports = {
    async addKanji(kanji) {
        try {
            conn = await pool.getConnection();

            sql = "INSERT INTO Kanji (kanji) VALUES (?)";
            const insertedKanji = await conn.query(sql, kanji);

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
    async updateKanji(kanji, strokeCount, meanings, kunReadings, onReadings, jlpt) {
        try {
            conn = await pool.getConnection();

            console.log(`Update Kanji SET strokeCount=${strokeCount}, meanings=${meanings}, kunReadings=${kunReadings}, onReadings=${onReadings}, jlpt=${jlpt} WHERE kanji=${kanji}`)
            sql = "Update Kanji SET strokeCount=?, meanings=?, kunReadings=?, onReadings=?, jlpt=? WHERE kanji=?";
            const updatedKanji = await conn.query(sql, [strokeCount, meanings, kunReadings, onReadings, jlpt, kanji]);

            conn.end();
            return updatedKanji;
        } catch (err) {
            throw err;
        }
    },
    async updateKanji(kanji, strokeCount, meanings, kunReadings, onReadings, jlpt) {
        try {
            conn = await pool.getConnection();

            console.log(`Update Kanji SET strokeCount=${strokeCount}, meanings=${meanings}, kunReadings=${kunReadings}, onReadings=${onReadings}, jlpt=${jlpt} WHERE kanji=${kanji}`)
            sql = "Update Kanji SET strokeCount=?, meanings=?, kunReadings=?, onReadings=?, jlpt=? WHERE kanji=?";
            const updatedKanji = await conn.query(sql, [strokeCount, meanings, kunReadings, onReadings, jlpt, kanji]);

            conn.end();
            return updatedKanji;
        } catch (err) {
            throw err;
        }
    },
};