export type Artist = {
  artist_id: number;
  artist_name: string;
}

export type PopularArtist = Artist & {
  articles_cnt: number;
  rank: number;
}