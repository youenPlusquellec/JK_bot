ALTER TABLE used_kanji ADD CONSTRAINT used_kanji_un UNIQUE KEY (serverId,kanjiId);
ALTER TABLE used_kanji ADD `timestamp` DATETIME DEFAULT current_timestamp() NOT NULL;