const pool = require('../common/utils/db');

module.exports = {
	async getGrammars() {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM grammar_point';
		const rows = await conn.query(sql);

		conn.end();
		return rows;
	},
	async getGrammarById(id) {
		const conn = await pool.getConnection();

		const sql = 'SELECT * FROM grammar_point WHERE id=?';
		const rows = await conn.query(sql, id);

		conn.end();
		return rows;
	},
	async getUsedGrammars(serverId) {
		const conn = await pool.getConnection();

		const sql = ` SELECT grammar_point.*, used_grammar.timestamp
                    FROM used_grammar
                    INNER JOIN server ON used_grammar.serverId=server.id
                    INNER JOIN grammar_point ON used_grammar.grammarId=grammar_point.id
                    WHERE used=1 AND server.serverId=?
					order by used_grammar.timestamp;`;
		const rows = await conn.query(sql, serverId);

		conn.end();
		return rows;
	},
	async getAvailableGrammars(serverId) {
		const conn = await pool.getConnection();

		const sql = ` SELECT *
                    FROM grammar_point 
                    WHERE id NOT IN
                        (SELECT grammarId
                        FROM used_grammar
                        INNER JOIN server ON used_grammar.serverId=server.id
                        INNER JOIN grammar_point ON used_grammar.grammarId=grammar_point.id
                        WHERE used=1 AND server.serverId=?);`;
		const rows = await conn.query(sql, serverId);

		conn.end();
		return rows;
	},
	async getAvailableRandomGrammar(serverId) {
		const availableGrammars = await this.getAvailableGrammars(serverId);
		const length = availableGrammars.length;

		if (!length) {
			return null;
		} else {
			return availableGrammars[Math.floor(Math.random() * length)];
		}
	},
	async getRandomGrammar() {
		const grammars = await this.getGrammars();
		const length = grammars.length;

		if (!length) {
			return null;
		} else {
			return grammars[Math.floor(Math.random() * length)];
		}
	},
	async useGrammarById(id, serverId) {
		const conn = await pool.getConnection();

		const sql = ` INSERT INTO used_grammar (grammarId, serverId) 
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
	async clearGrammars(serverId) {
		const conn = await pool.getConnection();

		const sql = ` UPDATE used_grammar 
                    INNER JOIN server ON used_grammar.serverId=server.id
                    SET used=false 
                    WHERE server.serverId=?`;

		const rows = await conn.query(sql, serverId);

		conn.end();
		return rows;
	},
	async restoreGrammars(serverId) {
		const conn = await pool.getConnection();

		const sql = ` UPDATE used_grammar 
                    INNER JOIN server ON used_grammar.serverId=server.id
                    SET used=true 
                    WHERE server.serverId=?`;

		const rows = await conn.query(sql, serverId);

		conn.end();
		return rows;
	},
};