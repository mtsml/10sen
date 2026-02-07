PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS article (
  id INTEGER PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  tweet_url TEXT
);

CREATE TABLE IF NOT EXISTS artist (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS song (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  artist_id INTEGER NOT NULL,
  video_id TEXT,
  FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS article_song_map (
  article_id INTEGER NOT NULL,
  song_id INTEGER NOT NULL,
  sort_no INTEGER NOT NULL,
  PRIMARY KEY (article_id, song_id),
  FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES song(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_article_year ON article(year);
CREATE INDEX IF NOT EXISTS idx_song_artist_id ON song(artist_id);
CREATE INDEX IF NOT EXISTS idx_article_song_map_song_id ON article_song_map(song_id);
CREATE INDEX IF NOT EXISTS idx_article_song_map_sort_no ON article_song_map(article_id, sort_no);
