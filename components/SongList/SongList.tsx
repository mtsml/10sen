import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import type { Song, PopularSong } from "@/types";
import styles from "./SongList.module.css";

const isPopularSong = (song: Song | PopularSong): song is PopularSong => {
  return "articles_cnt" in song;
}

type SongListProps = {
  songs: Song[] | PopularSong[];
  search?: boolean;
}

const SongList = ({ songs, search = false }: SongListProps) => {
  const [ filteredSongs, setFilteredSongs ] = useState(songs);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyWord = e.target.value;
    if (keyWord) {
      setFilteredSongs(songs.filter(song => song.song_name.includes(keyWord)));
    } else {
      setFilteredSongs(songs);
    }
  }

  return (
    <>
      {search
        && <div className="pure-form">
            <label>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
              />
            </label>
            <input
              type="text"
              className="pure-input-rounded"
              onChange={handleChange}
            />
          </div>
      }
      <ul className="pure-menu">
        {filteredSongs.map(song => (
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
    </>
  );
}

export default SongList;