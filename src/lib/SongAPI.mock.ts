import songsData from "@/mocks/songs.json";
import articlesData from "@/mocks/articles.json";
import type { Song, PopularSong } from "@/types/song";
import type { Article } from "@/types/article";
import type { PopularArtist } from "@/types/artists";


const fetchSongs = async (): Promise<Song[]> => {
  return songsData.map(song => ({
    song_id: song.song_id,
    song_name: song.song_name,
    artist_name: song.artist_name,
    video_id: song.video_id
  }));
};

const fetchPopularSongsByYear = async (year: number, limit: number = 3): Promise<PopularSong[]> => {
  const songsInYear = new Map<number, number>(); // song_id -> count

  articlesData.filter(article => article.year === year)
    .forEach(article => {
      article.songs?.forEach(song => {
        songsInYear.set(song.song_id, (songsInYear.get(song.song_id) || 0) + 1);
      });
    });

  const popularSongs: PopularSong[] = Array.from(songsInYear.entries())
    .map(([song_id, articles_cnt]) => {
      const song = songsData.find(s => s.song_id === song_id);
      if (!song) {
        throw new Error(`Song with id ${song_id} not found in mock data`);
      }
      return {
        song_id: song.song_id,
        song_name: song.song_name,
        artist_name: song.artist_name,
        video_id: song.video_id,
        articles_cnt,
        rank: 0 // Will be calculated after sorting
      };
    })
    .sort((a, b) => b.articles_cnt - a.articles_cnt)
    .slice(0, limit)
    .map((song, index) => ({ ...song, rank: index + 1 }));

  return popularSongs;
};

const fetchPopularArtistsByYear = async (year: number, limit: number = 3): Promise<PopularArtist[]> => {
  const artistsInYear = new Map<string, Set<number>>(); // artist_name -> Set<article_id>

  articlesData.filter(article => article.year === year)
    .forEach(article => {
      article.songs?.forEach(song => {
        if (!artistsInYear.has(song.artist_name)) {
          artistsInYear.set(song.artist_name, new Set());
        }
        artistsInYear.get(song.artist_name)?.add(article.id);
      });
    });

  const popularArtists: PopularArtist[] = Array.from(artistsInYear.entries())
    .map(([artist_name, article_ids]) => ({
      artist_name,
      artist_id: Math.abs(artist_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)), // Generate a mock artist_id
      articles_cnt: article_ids.size,
      rank: 0 // Will be calculated after sorting
    }))
    .sort((a, b) => b.articles_cnt - a.articles_cnt)
    .slice(0, limit)
    .map((artist, index) => ({ ...artist, rank: index + 1 }));

  return popularArtists;
};


const fetchSong = async (id: number): Promise<Song> => {
  const song = songsData.find(s => s.song_id === id);
  if (!song) {
    throw new Error(`Song with id ${id} not found`);
  }
  return song;
};

const fetchArticlesBySong = async (song_id: number): Promise<Article[]> => {
  return articlesData.filter(article =>
    article.songs?.some(song => song.song_id === song_id)
  ).map(article => ({
    id: article.id,
    url: article.url,
    name: article.name,
    year: article.year,
  }));
};

const fetchSongsByArtist = async (artist_name: string): Promise<Song[]> => {
  return songsData.filter(song => song.artist_name === artist_name);
};

const fetchArtists = async (): Promise<string[]> => {
  const artists = songsData.map(song => song.artist_name);
  return Array.from(new Set(artists)).sort();
};

const SongAPI = {
  fetchSong,
  fetchSongs,
  fetchPopularArtistsByYear,
  fetchPopularSongsByYear,
  fetchArticlesBySong,
  fetchSongsByArtist,
  fetchArtists,
};

export default SongAPI;
