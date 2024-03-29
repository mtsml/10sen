import { sql } from "@vercel/postgres";
import type { Article, RelatedArticle } from "@/types";

const fetchYears = async (): Promise<number[]> => {
  const result = await sql`
    SELECT
      DISTINCT year
    FROM
      article
    ORDER BY
      year DESC
  `;

  return result.rows.map(row => row.year);
}

const fetchArticles = async (): Promise<Article[]> => {
  const result = await sql`
    SELECT
      id,
      url,
      name
    FROM
      article
    ORDER BY
      id DESC
  `;

  return result.rows.map(row => ({
    id: row.id,
    url: row.url,
    name: row.name
  }));
}

const fetchArticlesByYear = async (year: number): Promise<Article[]> => {
  const result = await sql`
    SELECT
      id,
      url,
      name
    FROM
      article
    WHERE
      year = ${year}
    ORDER BY
      id DESC
  `;

  return result.rows.map(row => ({
    id: row.id,
    url: row.url,
    name: row.name
  }));
}

const fetchArticlesBySong = async (song_id: number): Promise<Article[]> => {
  const result = await sql`
    SELECT
      id,
      url,
      name
    FROM
      article
    WHERE
      EXISTS (
        SELECT
          1
        FROM
          article_song_map
        WHERE
          article_song_map.article_id = article.id
          AND article_song_map.song_id = ${song_id}
      )
    ORDER BY
      id DESC
  `;

  return result.rows.map(row => ({
    id: row.id,
    url: row.url,
    name: row.name
  }));
}

type fetchArticleRes = Omit<Article, "id"> & {
  tweetUrl: string;
  relatedArticles: RelatedArticle[];
}

const fetchArticle = async (id: number): Promise<fetchArticleRes> => {
  const articleQuery = sql`
    SELECT
      name,
      url,
      tweet_url
    FROM
      article
    WHERE
      id = ${id}
  `;

  const songQuery = sql`
    SELECT
      song.id AS song_id,
      song.name AS song_name,
      artist.name AS artist_name
    FROM
      article_song_map
      INNER JOIN song
        ON article_song_map.song_id = song.id
      INNER JOIN artist
        ON song.artist_id = artist.id
    WHERE
      article_id = ${id}
    ORDER BY
      article_song_map.sort_no
  `;
  
  const relatedArticlesQuery = sql`
    SELECT
      other.article_id AS id,
      (SELECT url FROM article WHERE id = other.article_id) AS url,
      (SELECT name FROM article WHERE id = other.article_id) AS name,
      COUNT(*) AS songs_cnt,
      SUM(me.sort_no) AS sort_no_sum,
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
      songs_cnt DESC,
      sort_no_sum,
      id DESC
  `;

  const result = await Promise.all([
    articleQuery, songQuery, relatedArticlesQuery
  ]);
  const [articleResult, songResult, relatedArticlesResult] = result;

  return {
    name: articleResult.rows[0].name,
    url: articleResult.rows[0].url,
    tweetUrl: articleResult.rows[0].tweet_url,
    songs: songResult.rows.map(row => ({
      song_id: row.song_id,
      song_name: row.song_name,
      artist_name: row.artist_name
    })),
    relatedArticles: relatedArticlesResult.rows.map(row => ({
      id: row.id,
      url: row.url,
      name: row.name,
      songs_name: row.songs_name
    }))
  }
}

const ArticleAPI = {
  fetchYears,
  fetchArticles,
  fetchArticlesByYear,
  fetchArticlesBySong,
  fetchArticle
}

export default ArticleAPI;