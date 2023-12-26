import { sql } from "@vercel/postgres";

interface fetchSongsRes {
  id: number;
  name: string;
  artist_id: number;
}
const fetchSongs = async (): Promise<fetchSongsRes[]> => {
  const { rows } = await sql`
    SELECT
      id,
      name,
      artist_id
    FROM
      song
    ORDER BY
      name
  `;
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    artist_id: row.artist_id
  }));
}

interface fetchPopularSongsByYearRes {
  song_id: number;
  song_name: string;
  artist_name: string;
  articles_cnt: number;
}
const fetchPopularSongsByYear = async (year: number): Promise<fetchPopularSongsByYearRes[]> => {
  const { rows } = await sql`
    SELECT
      song.id AS song_id,
      song.name AS song_name,
      artist.name AS artist_name,
      sub.articles_cnt AS articles_cnt
    FROM (
      SELECT
        song_id,
        COUNT(*) AS articles_cnt,
        DENSE_RANK() OVER (ORDER BY COUNT(*) desc) AS rank
      FROM
        article_song_map
        INNER JOIN article
          ON article_song_map.article_id = article.id
      WHERE
        year = ${year}
      GROUP BY
        song_id
    ) sub
      INNER JOIN song
        ON sub.song_id = song.id
      INNER JOIN artist
        ON song.artist_id = artist.id
    ORDER BY
      articles_cnt DESC,
      song_name,
      artist_name
  `;
  return rows.map(row => ({
    song_id: row.song_id,
    song_name: row.song_name,
    artist_name: row.artist_name,
    articles_cnt: row.articles_cnt
  }))
}

interface fetchSongRes {
  song_name: string;
  artist_name: string;
  video_id: string | null;
}
const fetchSong = async (id: number): Promise<fetchSongRes> => {
  const { rows } = await sql`
    SELECT
      song.name AS song_name,
      artist.name AS artist_name,
      song.video_id
    FROM
      song
      INNER JOIN artist
        ON song.artist_id = artist.id
    WHERE
      song.id = ${id}
  `;
  return {
    song_name: rows[0].song_name,
    artist_name: rows[0].artist_name,
    video_id: rows[0].video_id
  };
}

interface fetchArtistsRes {
  id: number;
  name: string;
}
const fetchArtists = async (): Promise<fetchArtistsRes[]> => {
  const { rows } = await sql`
    SELECT
      id,
      name
    FROM
      artist
    ORDER BY
      name
  `;
  return rows.map(row => ({
    id: row.id,
    name: row.name
  }));
}

const SongAPI = {
  fetchSong,
  fetchSongs,
  fetchPopularSongsByYear,
  fetchArtists
}

export default SongAPI;