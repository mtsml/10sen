import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

interface SongListProps {
  songs: Array<{
    song_id: number;
    song_name: string;
    artist_name: string;
    articles_cnt?: number;
  }>;
}
const SongList = ({ songs }: SongListProps) => {
  return (
    <ul className="pure-menu">
      {songs.map(song => (
        <li
          key={song.song_id}
          className="pure-menu-item flex-space-between"
        >
          <Link
            className="pure-menu-link"
            href={`/song/${encodeURIComponent(song.song_id)}`}
          >
            {song.song_name} / {song.artist_name}
          </Link>
          {song.articles_cnt &&
            <span className="article-cnt">
              {song.articles_cnt}<small> Posts</small>
            </span>
          }
        </li>
      ))}
    </ul>
  );
}

export default SongList;