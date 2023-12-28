import Link from "next/link";

interface SongListProps {
  songs: Array<{
    song_id: number;
    song_name: string;
    artist_name: string;
    articles_cnt?: number;
    rank?: number;
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
            <div className={`article-cnt rank${song.rank}`}>
              <span>{song.articles_cnt}</span>
              <small>Posts</small>
            </div>
          }
        </li>
      ))}
    </ul>
  );
}

export default SongList;