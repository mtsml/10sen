import articlesData from "@/mocks/articles.json";
import songsData from "@/mocks/songs.json";
import type { Article, RelatedArticle } from "@/types/article";

const fetchYears = async (): Promise<number[]> => {
  const years = articlesData.map(article => new Date(article.name.match(/\d{4}/)?.[0] || '2023').getFullYear());
  return Array.from(new Set(years)).sort((a, b) => b - a);
};

const fetchArticles = async (): Promise<Article[]> => {
  return articlesData.map(article => ({
    id: article.id,
    url: article.url,
    name: article.name,
  }));
};

const fetchArticlesByYear = async (year: number): Promise<Article[]> => {
  return articlesData.filter(article => new Date(article.name.match(/\d{4}/)?.[0] || '2023').getFullYear() === year)
    .map(article => ({
      id: article.id,
      url: article.url,
      name: article.name,
    }));
};

const fetchArticlesBySong = async (song_id: number): Promise<Article[]> => {
  return articlesData.filter(article =>
    article.songs?.some(song => song.song_id === song_id)
  ).map(article => ({
    id: article.id,
    url: article.url,
    name: article.name,
  }));
};

type fetchArticleRes = Omit<Article, "id"> & {
  tweetUrl: string;
  relatedArticles: RelatedArticle[];
}

const fetchArticle = async (id: number): Promise<fetchArticleRes> => {
  const article = articlesData.find(a => a.id === id);

  if (!article) {
    throw new Error(`Article with id ${id} not found`);
  }

  const articleSongs = article.songs || [];
  const relatedArticles: RelatedArticle[] = [];

  // Simulate related articles logic
  articlesData.forEach(otherArticle => {
    if (otherArticle.id !== article.id) {
      const commonSongs = articleSongs.filter(as =>
        otherArticle.songs?.some(os => os.song_id === as.song_id)
      );
      if (commonSongs.length > 0) {
        relatedArticles.push({
          id: otherArticle.id,
          url: otherArticle.url,
          name: otherArticle.name,
          songs_name: commonSongs.map(s => s.song_name).join(' / ')
        });
      }
    }
  });


  return {
    name: article.name,
    url: article.url,
    tweetUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.name)}`, // Mock tweet URL
    songs: articleSongs.map(s => ({
      song_id: s.song_id,
      song_name: s.song_name,
      artist_name: s.artist_name,
      video_id: songsData.find(sd => sd.song_id === s.song_id)?.video_id
    })),
    relatedArticles: relatedArticles.sort((a,b) => b.songs_name.localeCompare(a.songs_name)) // Simple sort for consistency
  };
};

const ArticleAPI = {
  fetchYears,
  fetchArticles,
  fetchArticlesByYear,
  fetchArticlesBySong,
  fetchArticle
};

export default ArticleAPI;
