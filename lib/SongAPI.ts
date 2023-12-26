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
  fetchSongs,
  fetchSong,
  fetchArtists
}

export default SongAPI;