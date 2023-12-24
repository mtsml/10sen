import Artist from "@/types/artist";

export default interface Song {
  id: number;
  name: string;
  artist: Artist;
}