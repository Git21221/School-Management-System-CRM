-- Run once on existing databases created before faculty photo support was added.
ALTER TABLE faculty ADD COLUMN photo_url TEXT NULL AFTER qualification;
