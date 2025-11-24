import { Song, PopularSong, Artist, PopularArtist } from "@/types";

const isPopularSong = (song: Song | PopularSong): song is PopularSong => {
  return "articles_cnt" in song;
}

export const songToItem = (song: Song | PopularSong) => {
  return {
    id: song.song_id,
    name: `${song.song_name} / ${song.artist_name}`,
    articles_cnt: isPopularSong(song) ? song.articles_cnt : undefined,
    rank: isPopularSong(song) ? song.rank : undefined
  }
}

const isPopularArtist = (artist: Artist | PopularArtist): artist is PopularArtist => {
  return "articles_cnt" in artist;
}

export const artistToItem = (artist: Artist | PopularArtist) => {
  return {
    id: artist.artist_id,
    name: artist.artist_name,
    articles_cnt: isPopularArtist(artist) ? artist.articles_cnt : undefined,
    rank: isPopularArtist(artist) ? artist.rank : undefined
  }
}