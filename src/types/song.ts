export type Song = {
  song_id: number;
  song_name: string;
  artist_name: string;
  video_id?: string;
}

export type PopularSong = Song & {
  articles_cnt: number;
  rank: number;
}