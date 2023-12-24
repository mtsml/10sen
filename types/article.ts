import Song from "@/types/song";

export default interface Article {
  id: number;
  url: string;
  name: string;
  songs?: Song[];
}
