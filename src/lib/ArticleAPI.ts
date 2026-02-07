import type { Article, RelatedArticle } from "@/types";
import { query } from "@/util/db";

type YearRow = {
  year: number;
};

type ArticleRow = {
  id: number;
  url: string;
  name: string;
};

type ArticleDetailRow = {
  name: string;
  url: string;
  tweet_url: string | null;
};

type SongRow = {
  song_id: number;
  song_name: string;
  artist_name: string;
};

type RelatedArticleRow = {
  id: number;
  url: string;
  name: string;
  songs_name: string;
};

const fetchYears = async (): Promise<number[]> => {
  const rows = await query<YearRow>(
    `
      SELECT DISTINCT year
      FROM article
      ORDER BY year DESC
    `
  );

  return rows.map((row) => row.year);
};

const fetchArticles = async (): Promise<Article[]> => {
  const rows = await query<ArticleRow>(
    `
      SELECT id, url, name
      FROM article
      ORDER BY id DESC
    `
  );

  return rows.map((row) => ({
    id: row.id,
    url: row.url,
    name: row.name,
  }));
};

const fetchArticlesByYear = async (year: number): Promise<Article[]> => {
  const rows = await query<ArticleRow>(
    `
      SELECT id, url, name
      FROM article
      WHERE year = ?
      ORDER BY id DESC
    `,
    [year]
  );

  return rows.map((row) => ({
    id: row.id,
    url: row.url,
    name: row.name,
  }));
};

const fetchArticlesBySong = async (song_id: number): Promise<Article[]> => {
  const rows = await query<ArticleRow>(
    `
      SELECT id, url, name
      FROM article
      WHERE EXISTS (
        SELECT 1
        FROM article_song_map
        WHERE article_song_map.article_id = article.id
          AND article_song_map.song_id = ?
      )
      ORDER BY id DESC
    `,
    [song_id]
  );

  return rows.map((row) => ({
    id: row.id,
    url: row.url,
    name: row.name,
  }));
};

type FetchArticleRes = Omit<Article, "id"> & {
  tweetUrl: string | null;
  relatedArticles: RelatedArticle[];
};

const fetchArticle = async (id: number): Promise<FetchArticleRes> => {
  const [articleRows, songRows, relatedArticleRows] = await Promise.all([
    query<ArticleDetailRow>(
      `
        SELECT name, url, tweet_url
        FROM article
        WHERE id = ?
      `,
      [id]
    ),
    query<SongRow>(
      `
        SELECT
          song.id AS song_id,
          song.name AS song_name,
          artist.name AS artist_name
        FROM article_song_map
        INNER JOIN song
          ON article_song_map.song_id = song.id
        INNER JOIN artist
          ON song.artist_id = artist.id
        WHERE article_id = ?
        ORDER BY article_song_map.sort_no
      `,
      [id]
    ),
    query<RelatedArticleRow>(
      `
        WITH related AS (
          SELECT
            other.article_id AS id,
            COUNT(*) AS songs_cnt,
            SUM(me.sort_no) AS sort_no_sum
          FROM article_song_map me
          INNER JOIN article_song_map other
            ON me.song_id = other.song_id
           AND me.article_id <> other.article_id
          WHERE me.article_id = ?
          GROUP BY other.article_id
        ),
        related_song_names AS (
          SELECT
            s.id,
            group_concat(s.song_name, ' / ') AS songs_name
          FROM (
            SELECT
              other.article_id AS id,
              song.name AS song_name,
              me.sort_no AS sort_no
            FROM article_song_map me
            INNER JOIN article_song_map other
              ON me.song_id = other.song_id
             AND me.article_id <> other.article_id
            INNER JOIN song
              ON song.id = other.song_id
            WHERE me.article_id = ?
            ORDER BY other.article_id, me.sort_no
          ) s
          GROUP BY s.id
        )
        SELECT
          related.id AS id,
          article.url AS url,
          article.name AS name,
          related_song_names.songs_name AS songs_name
        FROM related
        INNER JOIN article
          ON article.id = related.id
        LEFT JOIN related_song_names
          ON related_song_names.id = related.id
        ORDER BY
          related.songs_cnt DESC,
          related.sort_no_sum ASC,
          related.id DESC
      `,
      [id, id]
    ),
  ]);

  const article = articleRows[0];

  return {
    name: article.name,
    url: article.url,
    tweetUrl: article.tweet_url,
    songs: songRows.map((row) => ({
      song_id: row.song_id,
      song_name: row.song_name,
      artist_name: row.artist_name,
    })),
    relatedArticles: relatedArticleRows.map((row) => ({
      id: row.id,
      url: row.url,
      name: row.name,
      songs_name: row.songs_name,
    })),
  };
};

const ArticleAPI = {
  fetchYears,
  fetchArticles,
  fetchArticlesByYear,
  fetchArticlesBySong,
  fetchArticle,
};

export default ArticleAPI;
