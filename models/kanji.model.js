const axios = require('axios');
const pool = require("../common/utils/db");

module.exports = {
    async getKanjis() {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM Kanji";
            const rows = await conn.query(sql);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async getKanjiById(id) {
        try {
            conn = await pool.getConnection();

            sql = "SELECT * FROM Kanji WHERE id=?";
            const rows = await conn.query(sql, id);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async addKanji(kanji, available) {
        try {

            const kanjiInfo = await this.getKanjiInfo(kanji)
            
            conn = await pool.getConnection();

            sql = "INSERT INTO Kanji (kanji, strokeCount, meanings, kunReadings, onReadings, jlpt) VALUES (?, ?, ?, ?, ?, ?);";
            const insertedKanji = await conn.query(sql, [
                    kanji, 
                    kanjiInfo.stroke_count, 
                    JSON.stringify(kanjiInfo.meanings), 
                    JSON.stringify(kanjiInfo.kun_readings), 
                    JSON.stringify(kanjiInfo.on_readings), 
                    kanjiInfo.jlpt
                ]);

            if (!available) {
                sql = "INSERT INTO Used_kanji (kanjiId, serverId, used) VALUES (?, 1, true);";
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

            sql = "Update Kanji SET strokeCount=?, meanings=?, kunReadings=?, onReadings=?, jlpt=? WHERE kanji=?";
            const updatedKanji = await conn.query(sql, [strokeCount, meanings, kunReadings, onReadings, jlpt, kanji]);

            conn.end();
            return updatedKanji;
        } catch (err) {
            throw err;
        }
    },
    async getAvailableKanjis(serverId) {
        try {
            conn = await pool.getConnection();

            sql = ` SELECT *
                    FROM Kanji 
                    WHERE kanji NOT IN
                        (select kanji
                        from used_kanji
                        inner join Server on Used_kanji.serverId=Server.id
                        inner join Kanji on Used_kanji.kanjiId=Kanji.id
                        where used=1 and Server.serverId=?);`;
            const rows = await conn.query(sql, serverId);

            conn.end();
            return rows;
        } catch (err) {
            throw err;
        }
    },
    async getAvailableRandomKanji(serverId) {
        const availableKanjis = await this.getAvailableKanjis(serverId)
        const length = availableKanjis.length

        return availableKanjis[Math.floor(Math.random() * length)];
    },
    async useKanji(kanji, serverId) {
        try {
            conn = await pool.getConnection();

            sql = ` INSERT INTO Used_kanji (kanjiId, serverId) 
                    VALUES ( 
                        (select id from kanji where kanji.kanji=?), 
                        (select id from server where serverId=?)
                    );`;

            const insertedKanji = await conn.query(sql, [kanji, serverId]);

            conn.end();
            return insertedKanji;
        } catch (err) {
            throw err;
        }
    },
    async useKanjiById(id, serverId) {
        try {
            conn = await pool.getConnection();

            sql = ` INSERT INTO Used_kanji (kanjiId, serverId) 
                    VALUES ( 
                        ?, 
                        (select id from server where serverId=?)
                    );`;

            const insertedKanji = await conn.query(sql, [id, serverId]);

            conn.end();
            return insertedKanji;
        } catch (err) {
            throw err;
        }
    },
    async getKanjiInfo(kanji) {
        const path = encodeURI(`https://kanjiapi.dev/v1/kanji/${kanji}`);
        const res = await axios.get(path);
        return res.data;
    },
};