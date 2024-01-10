import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
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
  const [ keyWord, setKeyWord ] = useState("");

  const filterSongs = (song: Song) => {
    if (!keyWord) return true;
    return (
      song.song_name.toLowerCase().includes(keyWord.toLowerCase())
      || song.artist_name.toLowerCase().includes(keyWord.toLowerCase())
    );
  }

  return (
    <>
      {search
        && <div className={styles.search}>
            <label>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
              />
            </label>
            <input
              type="text"
              value={keyWord}
              placeholder="曲名または歌手名を入力してください"
              onChange={(e) => setKeyWord(e.target.value)}
            />
            {keyWord
              && <FontAwesomeIcon
                  className={styles["xmark-icon"]}
                  icon={faCircleXmark}
                  size="lg"
                  onClick={() => setKeyWord("")}
                />
            }
          </div>
      }
      <ul className="pure-menu">
        {songs.filter(filterSongs).map(song => (
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