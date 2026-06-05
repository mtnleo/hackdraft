-- Hackathon Idea Generator — Cloudflare D1 (SQLite) schema
-- Apply with: wrangler d1 execute hackathon-db --file=data/schema.sql --remote
--
-- Notes:
--  * D1 is SQLite: no native ARRAY or BOOLEAN. tags is stored as a JSON string.
--  * topic / time_bucket / difficulty / tag IDs are canonical English slugs and
--    are the filtering keys — never store translated values in these columns.
--  * Spanish display labels live in data/topics.json (frontend), not here.
--  * Only name + long_description are translated (name_es, long_description_es).

DROP TABLE IF EXISTS ideas;

CREATE TABLE ideas (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  name                TEXT NOT NULL,   -- EN headline, 40-70 chars
  name_es             TEXT NOT NULL,   -- ES translation
  long_description    TEXT NOT NULL,   -- EN, 3-4 sentences, ~300-450 chars (hard cap 550)
  long_description_es TEXT NOT NULL,   -- ES translation
  topic               TEXT NOT NULL,   -- canonical slug, e.g. 'cybersecurity'
  time_bucket         TEXT NOT NULL,   -- '1-3h'|'3-6h'|'6-12h'|'12-24h'|'24-48h'|'48h+'
  min_hours           INTEGER NOT NULL,
  max_hours           INTEGER NOT NULL,
  difficulty          TEXT NOT NULL,   -- 'beginner'|'intermediate'|'advanced'
  tags                TEXT NOT NULL    -- JSON array of slugs, e.g. '["lights","sensors"]'
);

-- Primary access path: filter by topic + time_bucket, then ORDER BY RANDOM().
CREATE INDEX idx_topic_time ON ideas (topic, time_bucket);

-- Supports the UI fallback (nearest time bucket within the same topic).
CREATE INDEX idx_topic ON ideas (topic);
