import fs from "node:fs";
import path from "node:path";
import type { Article, PopularArtist, PopularSong, RelatedArticle, Song } from "@/types";

type ArticleRow = {
  id: number;
  url: string;
  name: string;
  year: number;
  tweet_url: string | null;
};

type ArtistRow = { id: number; name: string };
type SongRow = { id: number; name: string; artist_id: number; video_id: string | null };
type ArticleSongMapRow = { article_id: number; song_id: number; sort_no: number };

type Snapshot = {
  articles: ArticleRow[];
  artists: ArtistRow[];
  songs: SongRow[];
  articleSongMaps: ArticleSongMapRow[];
};

const loadSnapshot = (): Snapshot => {
  const snapshotPath = path.join(process.cwd(), "src/generated/site-data.json");
  try {
    return JSON.parse(fs.readFileSync(snapshotPath, "utf8")) as Snapshot;
  } catch (error) {
    throw new Error(`Static site data is missing. Run \"npm run site:data\" before building. (${String(error)})`);
  }
};

const snapshot = loadSnapshot();
const artistsById = new Map(snapshot.artists.map((artist) => [artist.id, artist]));
const songsById = new Map(snapshot.songs.map((song) => [song.id, song]));
const articlesById = new Map(snapshot.articles.map((article) => [article.id, article]));
const mapsByArticleId = new Map<number, ArticleSongMapRow[]>();

for (const map of snapshot.articleSongMaps) {
  const maps = mapsByArticleId.get(map.article_id) ?? [];
  maps.push(map);
  mapsByArticleId.set(map.article_id, maps);
}

for (const maps of Array.from(mapsByArticleId.values())) {
  maps.sort((a, b) => a.sort_no - b.sort_no);
}

const toSong = (song: SongRow): Song => {
  const artist = artistsById.get(song.artist_id);
  if (!artist) throw new Error(`Missing artist ${song.artist_id}`);
  return {
    song_id: song.id,
    song_name: song.name,
    artist_name: artist.name,
    video_id: song.video_id,
  };
};

const toArticle = (article: ArticleRow): Article => ({ id: article.id, url: article.url, name: article.name });

const fetchYears = async (): Promise<number[]> =>
  Array.from(new Set(snapshot.articles.map((article) => article.year))).sort((a, b) => b - a);

const fetchArticles = async (): Promise<Article[]> => snapshot.articles.slice().sort((a, b) => b.id - a.id).map(toArticle);

const fetchArticlesByYear = async (year: number): Promise<Article[]> =>
  snapshot.articles.filter((article) => article.year === year).sort((a, b) => b.id - a.id).map(toArticle);

const fetchArticlesBySong = async (songId: number): Promise<Article[]> => {
  const articleIds = new Set(
    snapshot.articleSongMaps.filter((map) => map.song_id === songId).map((map) => map.article_id)
  );
  return snapshot.articles.filter((article) => articleIds.has(article.id)).sort((a, b) => b.id - a.id).map(toArticle);
};

const fetchPopularSongsByYear = async (year: number, limit: number = 3): Promise<PopularSong[]> => {
  const articleIds = new Set(snapshot.articles.filter((article) => article.year === year).map((article) => article.id));
  const counts = new Map<number, number>();
  for (const map of snapshot.articleSongMaps) {
    if (articleIds.has(map.article_id)) counts.set(map.song_id, (counts.get(map.song_id) ?? 0) + 1);
  }

  const ranked = Array.from(counts, ([songId, articles_cnt]) => ({ ...toSong(songsById.get(songId)!), articles_cnt }))
    .sort((a, b) => b.articles_cnt - a.articles_cnt || a.song_name.localeCompare(b.song_name) || a.artist_name.localeCompare(b.artist_name));
  let rank = 0;
  let previousCount: number | undefined;
  return ranked
    .map((song) => {
      if (song.articles_cnt !== previousCount) rank += 1;
      previousCount = song.articles_cnt;
      return { ...song, rank };
    })
    .filter((song) => song.rank <= limit);
};

const fetchPopularArtistsByYear = async (year: number, limit: number = 3): Promise<PopularArtist[]> => {
  const articleIds = new Set(snapshot.articles.filter((article) => article.year === year).map((article) => article.id));
  const counts = new Map<number, { articleIds: Set<number>; songCount: number }>();
  for (const map of snapshot.articleSongMaps) {
    if (!articleIds.has(map.article_id)) continue;
    const song = songsById.get(map.song_id)!;
    const count = counts.get(song.artist_id) ?? { articleIds: new Set<number>(), songCount: 0 };
    count.articleIds.add(map.article_id);
    count.songCount += 1;
    counts.set(song.artist_id, count);
  }

  const ranked = Array.from(counts, ([artistId, count]) => ({
    artist_id: artistId,
    artist_name: artistsById.get(artistId)!.name,
    articles_cnt: count.articleIds.size,
    songCount: count.songCount,
  })).sort((a, b) => b.articles_cnt - a.articles_cnt || b.songCount - a.songCount || a.artist_name.localeCompare(b.artist_name));

  let rank = 0;
  let previous: Pick<(typeof ranked)[number], "articles_cnt" | "songCount"> | undefined;
  return ranked.map((artist) => {
    if (!previous || artist.articles_cnt !== previous.articles_cnt || artist.songCount !== previous.songCount) rank += 1;
    previous = artist;
    return { artist_id: artist.artist_id, artist_name: artist.artist_name, articles_cnt: artist.articles_cnt, rank };
  }).filter((artist) => artist.rank <= limit);
};

const fetchSong = async (id: number): Promise<Omit<Song, "song_id">> => {
  const song = songsById.get(id);
  if (!song) throw new Error(`Song ${id} not found`);
  const { song_id: _songId, ...result } = toSong(song);
  return result;
};

const fetchArticle = async (id: number): Promise<Omit<Article, "id"> & { tweetUrl: string | null; relatedArticles: RelatedArticle[] }> => {
  const article = articlesById.get(id);
  if (!article) throw new Error(`Article ${id} not found`);
  const articleMaps = mapsByArticleId.get(id) ?? [];
  const sharedSongs = new Map<number, { songsCnt: number; sortNoSum: number; names: string[] }>();

  for (const [otherArticleId, otherMaps] of Array.from(mapsByArticleId.entries())) {
    if (otherArticleId === id) continue;
    const otherSongIds = new Set(otherMaps.map((map) => map.song_id));
    for (const sourceMap of articleMaps) {
      if (!otherSongIds.has(sourceMap.song_id)) continue;
      const shared = sharedSongs.get(otherArticleId) ?? { songsCnt: 0, sortNoSum: 0, names: [] };
      shared.songsCnt += 1;
      shared.sortNoSum += sourceMap.sort_no;
      shared.names.push(songsById.get(sourceMap.song_id)!.name);
      sharedSongs.set(otherArticleId, shared);
    }
  }

  const relatedArticles = Array.from(sharedSongs, ([articleId, shared]) => {
    const related = articlesById.get(articleId)!;
    return { ...toArticle(related), songs_name: shared.names.join(" / "), songsCnt: shared.songsCnt, sortNoSum: shared.sortNoSum };
  }).sort((a, b) => b.songsCnt - a.songsCnt || a.sortNoSum - b.sortNoSum || b.id - a.id)
    .map(({ songsCnt: _songsCnt, sortNoSum: _sortNoSum, ...related }) => related);

  return {
    ...toArticle(article),
    tweetUrl: article.tweet_url,
    songs: articleMaps.map((map) => toSong(songsById.get(map.song_id)!)),
    relatedArticles,
  };
};

const StaticArticleAPI = { fetchYears, fetchArticles, fetchArticlesByYear, fetchArticlesBySong, fetchArticle };
const StaticSongAPI = { fetchSong, fetchSongs: async () => snapshot.songs.map(toSong).sort((a, b) => a.song_name.localeCompare(b.song_name)), fetchAllSongIds: async () => snapshot.songs.map((song) => ({ song_id: song.id })), fetchPopularArtistsByYear, fetchPopularSongsByYear };

export { StaticArticleAPI, StaticSongAPI, snapshot };
