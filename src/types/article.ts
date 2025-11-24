import { Song } from "@/types/song";

export type Article = {
  id: number;
  url: string;
  name: string;
  songs?: Song[];
}

export type RelatedArticle = Omit<Article, "songs"> & {
  songs_name: string;
}