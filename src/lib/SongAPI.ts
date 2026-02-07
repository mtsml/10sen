import type { Song, PopularArtist, PopularSong } from "@/types";
import { query } from "@/util/db";

type SongRow = {
  song_id: number;
  song_name: string;
  artist_name: string;
  video_id?: string | null;
};

type PopularSongRow = SongRow & {
  articles_cnt: number;
  rank: number;
};

type PopularArtistRow = {
  artist_id: number;
  artist_name: string;
  articles_cnt: number;
  rank: number;
};

const fetchSongs = async (): Promise<Song[]> => {
  const rows = await query<SongRow>(
    `
      SELECT
        song.id AS song_id,
        song.name AS song_name,
        artist.name AS artist_name
      FROM song
      INNER JOIN artist
        ON song.artist_id = artist.id
      ORDER BY song_name
    `
  );

  return rows.map((row) => ({
    song_id: row.song_id,
    song_name: row.song_name,
    artist_name: row.artist_name,
  }));
};

const fetchAllSongIds = async (): Promise<Pick<Song, "song_id">[]> => {
  const rows = await query<Pick<Song, "song_id">>(
    `
      SELECT song.id AS song_id
      FROM song
      ORDER BY song_id
    `
  );

  return rows.map((row) => ({
    song_id: row.song_id,
  }));
};

const fetchPopularSongsByYear = async (year: number, limit: number = 3): Promise<PopularSong[]> => {
  const rows = await query<PopularSongRow>(
    `
      SELECT
        song.id AS song_id,
        song.name AS song_name,
        artist.name AS artist_name,
        song_agg.articles_cnt AS articles_cnt,
        song_agg.rank AS rank
      FROM (
        SELECT
          song_id,
          COUNT(*) AS articles_cnt,
          DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS rank
        FROM article_song_map
        INNER JOIN article
          ON article_song_map.article_id = article.id
        WHERE year = ?
        GROUP BY song_id
      ) song_agg
      INNER JOIN song
        ON song_agg.song_id = song.id
      INNER JOIN artist
        ON song.artist_id = artist.id
      WHERE rank <= ?
      ORDER BY
        articles_cnt DESC,
        song_name,
        artist_name
    `,
    [year, limit]
  );

  return rows.map((row) => ({
    song_id: row.song_id,
    song_name: row.song_name,
    artist_name: row.artist_name,
    articles_cnt: row.articles_cnt,
    rank: row.rank,
  }));
};

const fetchPopularArtistsByYear = async (year: number, limit: number = 3): Promise<PopularArtist[]> => {
  const rows = await query<PopularArtistRow>(
    `
      SELECT
        artist.id AS artist_id,
        artist.name AS artist_name,
        artist_agg.articles_cnt AS articles_cnt,
        artist_agg.rank AS rank
      FROM (
        SELECT
          song.artist_id AS artist_id,
          COUNT(DISTINCT article_id) AS articles_cnt,
          DENSE_RANK() OVER (
            ORDER BY COUNT(DISTINCT article.id) DESC, COUNT(article.id) DESC
          ) AS rank
        FROM article_song_map
        INNER JOIN song
          ON article_song_map.song_id = song.id
        INNER JOIN article
          ON article_song_map.article_id = article.id
        WHERE year = ?
        GROUP BY song.artist_id
      ) artist_agg
      INNER JOIN artist
        ON artist_agg.artist_id = artist.id
      WHERE rank <= ?
      ORDER BY
        rank,
        artist_name
    `,
    [year, limit]
  );

  return rows.map((row) => ({
    artist_id: row.artist_id,
    artist_name: row.artist_name,
    articles_cnt: row.articles_cnt,
    rank: row.rank,
  }));
};

const fetchSong = async (id: number): Promise<Omit<Song, "song_id">> => {
  const rows = await query<SongRow>(
    `
      SELECT
        song.name AS song_name,
        artist.name AS artist_name,
        song.video_id AS video_id
      FROM song
      INNER JOIN artist
        ON song.artist_id = artist.id
      WHERE song.id = ?
    `,
    [id]
  );

  const row = rows[0];
  return {
    song_name: row.song_name,
    artist_name: row.artist_name,
    video_id: row.video_id ?? undefined,
  };
};

const SongAPI = {
  fetchSong,
  fetchSongs,
  fetchAllSongIds,
  fetchPopularArtistsByYear,
  fetchPopularSongsByYear,
};

export default SongAPI;
