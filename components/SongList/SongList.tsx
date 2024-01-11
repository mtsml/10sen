import Link from "next/link";
import type { Song, PopularSong } from "@/types";
import styles from "./SongList.module.css";

const isPopularSong = (song: Song | PopularSong): song is PopularSong => {
  return "articles_cnt" in song;
}

type SongListProps = {
  songs : Song[] | PopularSong[];
}

const SongList = ({ songs }: SongListProps) => {
  return (
    <ul className="pure-menu">
      {songs.map(song => (
        <li
          key={song.song_id}
          className="pure-menu-item"
        >
          <Link
            className="pure-menu-link"
            href={`/song/${encodeURIComponent(song.song_id)}`}
          >
            {song.song_name} / {song.artist_name}
          </Link>
          {isPopularSong(song) &&
            <div className={`${styles["article-cnt"]} ${styles[`-rank${song.rank}`]}`}>
              <span>{song.articles_cnt}</span>
              <span className={styles.suffix}>{Number(song.articles_cnt) === 1 ? "Post" : "Posts"}</span>
            </div>
          }
        </li>
      ))}
    </ul>
  );
}

export default SongList;