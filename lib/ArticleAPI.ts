import { sql, db } from "@vercel/postgres";

const fetchYears = async (): Promise<number[]> => {
  const result = await sql`
    SELECT
      DISTINCT year
    FROM
      article
    ORDER BY
      year DESC
    ;
  `;
  return result.rows.map(row => row.year);
}

interface fetchArticlesRes {
  id: number;
  url: string;
  name: string;
}
const fetchArticles = async (
    year: number | undefined,
    song_id: number | undefined,
    artist_id: number | undefined
  ): Promise<fetchArticlesRes[]> =>
{
  const conditions = [];
  const values = [];
  if (year) {
    values.push(year);
    conditions.push(`year = $${values.length}`);
  }
  if (song_id) {
    values.push(song_id);
    conditions.push(`EXISTS (
      SELECT
        1
      FROM
        article_song_map
      WHERE
        article_song_map.article_id = article.id
        AND article_song_map.song_id = $${values.length}
    )`);
  }
  if (artist_id) {
    values.push(song_id);
    conditions.push(`EXISTS (
      SELECT
        1
      FROM
        article_song_map
        INNER JOIN song
          ON article_song_map.song_id = song.id
      WHERE
        article_song_map.article_id = article.id
        AND song.artist_id = $${values.length}
    )`);
  }

  let where = "";
  if (conditions.length !== 0) {
    where = `WHERE ` + conditions.join(" AND ")
  }

  const client = await db.connect();
  const result = await client.query(`
    SELECT
      id,
      url,
      name
    FROM
      article
    ${where}
    ORDER BY
      id DESC
  `, values);

  return result.rows.map(row => ({
    id: row.id,
    url: row.url,
    name: row.name
  }));
}

interface fetchArticleRes {
  url: string;
  name: string;
  songs: Array<{
    song_id: number,
    song_name: string,
    artist_id: number,
    artist_name: string
  }>;
  relatedArticles: Array<{
    id: number;
    url: string;
    name: string;
    songs_cnt: number;
    songs_name: string;
  }>;
}
const fetchArticle = async (id: number): Promise<fetchArticleRes> => {
  const articleQuery = sql`
    SELECT
      name,
      url
    FROM
      article
    WHERE
      id = ${id}
    ;
  `;

  const songQuery = sql`
    SELECT
      song.id AS song_id,
      song.name AS song_name,
      artist.id AS artist_id,
      artist.name AS artist_name
    FROM
      article_song_map
      INNER JOIN song
        ON article_song_map.song_id = song.id
      INNER JOIN artist
        ON song.artist_id = artist.id
    WHERE
      article_id = ${id}
  `;
  
  const relatedArticlesQuery = sql`
    SELECT
      other.article_id AS id,
      (SELECT url FROM article WHERE id = other.article_id) AS url,
      (SELECT name FROM article WHERE id = other.article_id) AS name,
      COUNT(*) AS songs_cnt,
      STRING_AGG(
        (SELECT name FROM song WHERE id = other.song_id),
        ' / ' ORDER BY me.sort_no
      ) AS songs_name
    FROM
      article_song_map me
      INNER JOIN article_song_map other
        ON me.song_id = other.song_id
        AND me.article_id <> other.article_id
    WHERE
      me.article_id = ${id}
    GROUP BY
      other.article_id
    ORDER BY
      songs_cnt DESC
  `;

  const result = await Promise.all([
    articleQuery, songQuery, relatedArticlesQuery
  ]);
  const [articleResult, songResult, relatedArticlesResult] = result;

  return {
    name: articleResult.rows[0].name,
    url: articleResult.rows[0].url,
    songs: songResult.rows.map(row => ({
      song_id: row.song_id,
      song_name: row.song_name,
      artist_id: row.artist_id,
      artist_name: row.artist_name
    })),
    relatedArticles: relatedArticlesResult.rows.map(row => ({
      id: row.id,
      url: row.url,
      name: row.name,
      songs_cnt: row.songs_cnt,
      songs_name: row.songs_name
    }))
  }
}

const ArticleAPI = {
  fetchYears,
  fetchArticles,
  fetchArticle
}

export default ArticleAPI;