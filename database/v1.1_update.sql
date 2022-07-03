ALTER TABLE used_kanji ADD CONSTRAINT used_kanji_un UNIQUE KEY (serverId,kanjiId);
ALTER TABLE firstdb.server ADD CONSTRAINT server_un UNIQUE KEY (serverId);
ALTER TABLE firstdb.user_account ADD CONSTRAINT user_account_un UNIQUE KEY (userId);
ALTER TABLE used_kanji ADD `timestamp` DATETIME DEFAULT current_timestamp() NOT NULL;