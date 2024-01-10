import { sql } from "@vercel/postgres";
import type { Song, PopularSong } from "@/types";

const fetchSongs = async (): Promise<Song[]> => {
  const { rows } = await sql`
    SELECT
      song.id AS song_id,
      song.name AS song_name,
      artist.name AS artist_name
    FROM
      song
      INNER JOIN artist
        ON song.artist_id = artist_id
    ORDER BY
      song_name
  `;

  return rows.map(row => ({
    song_id: row.song_id,
    song_name: row.song_name,
    artist_name: row.artist_name
  }));
}

const fetchPopularSongsByYear = async (year: number, limit: number = 3): Promise<PopularSong[]> => {
  const { rows } = await sql`
    SELECT
      song.id AS song_id,
      song.name AS song_name,
      artist.name AS artist_name,
      articles_cnt,
      rank
    FROM (
      SELECT
        song_id,
        COUNT(*) AS articles_cnt,
        DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS rank
      FROM
        article_song_map
        INNER JOIN article
          ON article_song_map.article_id = article.id
      WHERE
        year = ${year}
      GROUP BY
        song_id
    ) song_agg
      INNER JOIN song
        ON song_agg.song_id = song.id
      INNER JOIN artist
        ON song.artist_id = artist.id
    WHERE
      rank <= ${limit}
    ORDER BY
      articles_cnt DESC,
      song_name,
      artist_name
  `;

  return rows.map(row => ({
    song_id: row.song_id,
    song_name: row.song_name,
    artist_name: row.artist_name,
    articles_cnt: row.articles_cnt,
    rank: row.rank
  }));
}

const fetchSong = async (id: number): Promise<Omit<Song, "song_id">> => {
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

const SongAPI = {
  fetchSong,
  fetchSongs,
  fetchPopularSongsByYear
}

export default SongAPI;