const pool = require('../common/utils/db');


module.exports = {
	async getVocabularies() {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM vocabulary';
		const rows = await conn.query(sql);

		conn.end();
		return rows;
	},
	async getVocabulariesByJlpt(jlpt) {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM vocabulary WHERE jlpt=?';
		const rows = await conn.query(sql, jlpt);

		conn.end();
		return rows;
	},
	async getVocabularyById(id) {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM vocabulary WHERE id=?';
		const rows = await conn.query(sql, id);

		conn.end();
		return rows;
	},
	async addVocabulary(vocabulary, reading, meanings, jlpt) {

		const conn = await pool.getConnection();

		const sql_kanji = 'INSERT INTO vocabulary (vocabulary, reading, meanings, jlpt) VALUES (?, ?, ?, ?);';
		const rows = await conn.query(sql_kanji, [
			vocabulary,
			reading,
			JSON.stringify(meanings),
			jlpt,
		]);

		conn.end();
		return rows;
	},
	async getUsedVocabularies(serverId) {
		const conn = await pool.getConnection();

		const sql = ` SELECT vocabulary.*, used_vocabulary.timestamp
                    FROM used_vocabulary
                    INNER JOIN server ON used_vocabulary.serverId=server.id
                    INNER JOIN vocabulary ON used_vocabulary.vocabularyId=vocabulary.id
                    WHERE used=1 AND server.serverId=?
					order by used_vocabulary.timestamp;`;
		const rows = await conn.query(sql, serverId);

		conn.end();
		return rows;
	},
	async getUsedVocabulariesByJlpt(serverId, jlpt) {
		const conn = await pool.getConnection();

		const sql = ` SELECT vocabulary.*, used_vocabulary.timestamp
                    FROM used_vocabulary
                    INNER JOIN server ON used_vocabulary.serverId=server.id
                    INNER JOIN vocabulary ON used_vocabulary.vocabularyId=vocabulary.id
                    WHERE used=1 AND server.serverId=? AND vocabulary.jlpt=?
					order by used_vocabulary.timestamp;`;
		const rows = await conn.query(sql, [serverId, jlpt]);

		conn.end();
		return rows;
	},
	async getAvailableVocabularies(serverId) {
		const conn = await pool.getConnection();

		const sql = ` SELECT *
                    FROM vocabulary 
                    WHERE vocabulary NOT IN
                        (SELECT vocabulary
                        FROM used_vocabulary
                        INNER JOIN server ON used_vocabulary.serverId=server.id
                        INNER JOIN vocabulary ON used_vocabulary.vocabularyId=vocabulary.id
                        WHERE used=1 AND server.serverId=?);`;
		const rows = await conn.query(sql, serverId);

		conn.end();
		return rows;
	},
	async getAvailableVocabulariesByJlpt(serverId, jlpt) {
		const conn = await pool.getConnection();

		const sql = ` SELECT *
                    FROM vocabulary 
                    WHERE vocabulary.jlpt=? AND vocabulary NOT IN
                        (SELECT vocabulary
                        FROM used_vocabulary
                        INNER JOIN server ON used_vocabulary.serverId=server.id
                        INNER JOIN vocabulary ON used_vocabulary.vocabularyId=vocabulary.id
                        WHERE used=1 AND server.serverId=?);`;
		const rows = await conn.query(sql, [jlpt, serverId]);

		conn.end();
		return rows;
	},
	async getAvailableRandomVocabulary(serverId) {
		const availableVocabulary = await this.getAvailableVocabularies(serverId);
		const length = availableVocabulary.length;

		if (!length) {
			return null;
		} else {
			return availableVocabulary[Math.floor(Math.random() * length)];
		}
	},
	async getAvailableRandomVocabularyByJlpt(serverId, jlpt) {
		const availableVocabulary = await this.getAvailableVocabulariesByJlpt(serverId, jlpt);
		const length = availableVocabulary.length;

		if (!length) {
			return null;
		} else {
			return availableVocabulary[Math.floor(Math.random() * length)];
		}
	},
	async getRandomVocabulary() {
		const vocabularies = await this.getVocabularies();
		const length = vocabularies.length;

		if (!length) {
			return null;
		} else {
			return vocabularies[Math.floor(Math.random() * length)];
		}
	},
	async getRandomVocabularyByJlpt(jlpt) {
		const vocabularies = await this.getVocabulariesByJlpt(jlpt);
		const length = vocabularies.length;

		if (!length) {
			return null;
		} else {
			return vocabularies[Math.floor(Math.random() * length)];
		}
	},
	async useVocabulary(vocabulary, serverId) {
		const conn = await pool.getConnection();

		const sql = ` INSERT INTO used_vocabulary (vocabularyId, serverId) 
                    VALUES ( 
                        (select id from vocabulary where vocabulary.vocabulary=?), 
                        (select id from server where serverId=?)
                    )
                    ON DUPLICATE KEY update
                    used=true,
                    timestamp=current_timestamp();`;

		const rows = await conn.query(sql, [vocabulary, serverId]);

		conn.end();
		return rows;
	},
	async useVocabularyById(id, serverId) {
		const conn = await pool.getConnection();

		const sql = ` INSERT INTO used_vocabulary (vocabularyId, serverId) 
                    VALUES ( 
                        ?, 
                        (select id from server where serverId=?)
                    )
                    ON DUPLICATE KEY update
	                used=true,
                    timestamp=current_timestamp();`;

		const rows = await conn.query(sql, [id, serverId]);

		conn.end();
		return rows;
	},
	async clearVocabularies(serverId) {
		const conn = await pool.getConnection();

		const sql = ` UPDATE used_vocabulary 
                    INNER JOIN server ON used_vocabulary.serverId=server.id
                    SET used=false 
                    WHERE server.serverId=?;`;

		const rows = await conn.query(sql, serverId);

		conn.end();
		return rows;
	},
	async clearVocabulariesByJlpt(serverId, jlpt) {
		const conn = await pool.getConnection();

		const sql = ` UPDATE used_vocabulary 
                    INNER JOIN server ON used_vocabulary.serverId=server.id
					INNER JOIN vocabulary ON used_vocabulary.vocabularyId=vocabulary.id
                    SET used=false 
                    WHERE server.serverId=? AND vocabulary.jlpt=?;`;

		const rows = await conn.query(sql, [serverId, jlpt]);

		conn.end();
		return rows;
	},
	async restoreVocabularies(serverId) {
		const conn = await pool.getConnection();

		const sql = ` UPDATE used_vocabulary 
                    INNER JOIN server ON used_vocabulary.serverId=server.id
                    SET used=true 
                    WHERE server.serverId=?;`;

		const rows = await conn.query(sql, serverId);

		conn.end();
		return rows;
	},
	async restoreVocabulariesByJlpt(serverId, jlpt) {
		const conn = await pool.getConnection();

		const sql = ` UPDATE used_vocabulary 
                    INNER JOIN server ON used_vocabulary.serverId=server.id
					INNER JOIN vocabulary ON used_vocabulary.vocabularyId=vocabulary.id
                    SET used=true 
                    WHERE server.serverId=? AND vocabulary.jlpt=?;`;

		const rows = await conn.query(sql, [serverId, jlpt]);

		conn.end();
		return rows;
	},
};
