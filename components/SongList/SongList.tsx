import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router'
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
  const router = useRouter();

  useEffect(() => {
    // クエリパラメータが使用可能な状態になるまで待機する
    // https://nextjs-ja-translation-docs.vercel.app/docs/advanced-features/automatic-static-optimization
    if (router.isReady) {
      const keyWord = router.query.keyword;
      if (keyWord) {
        setKeyWord(String(keyWord));
      }
    }
  }, [router.isReady]);

  /**
   * ブラウザバック時に絞り込み状態を保持するためにHitoryを書き換える
   */
  const setQueryParam = (keyWord: string) => {
    const pathname = router.asPath.replace(/\?.+/, "");
    const url = keyWord ? `${pathname}?keyword=${keyWord}` : pathname;
    router.replace(url, undefined, { shallow: true });
  }

  /**
   * song_nameまたはartist_nameが一致しているかを大文字・小文字を区別せずに検証する
   */
  const isMatchKeyWord = (song: Song, keyWord: string) => {
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
            <label
              htmlFor="song-search"
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
              />
            </label>
            <input
              id="song-search"
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
        {songs.filter((song) => isMatchKeyWord(song, keyWord)).map(song => (
          <li
            key={song.song_id}
            className="pure-menu-item"
          >
            <Link
              className="pure-menu-link"
              href={`/song/${encodeURIComponent(song.song_id)}`}
              onClick={() => setQueryParam(keyWord)}
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