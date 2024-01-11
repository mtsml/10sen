import { useEffect, useState } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./ItemList.module.css";
import { UrlObject } from "url";

type Item = {
  id: number;
  name: string;
  articles_cnt?: number;
  rank?: number;
}

type Url = string | UrlObject;

type ItemListProps = {
  items: Item[];
  makeHref: (item: Item) => Url;
  search?: boolean;
  searchPlaceholder?: string;
}

const ItemList = ({ items, makeHref, search = false, searchPlaceholder }: ItemListProps) => {
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
   * ブラウザバック時に絞り込み状態を保持するためにHistoryを書き換える
   */
  const setQueryParam = (keyWord: string) => {
    const pathname = router.asPath.replace(/\?.+/, "");
    const url = keyWord ? `${pathname}?keyword=${keyWord}` : pathname;
    router.replace(url, undefined, { shallow: true });
  }

  /**
   * item.nameがkeyWordと一致しているかを大文字・小文字を区別せずに検証する
   */
  const isMatchKeyWord = (item: Item, keyWord: string) => {
    return !keyWord || item.name.toLowerCase().includes(keyWord.toLowerCase());
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
              placeholder={searchPlaceholder}
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
        {items.filter((item) => isMatchKeyWord(item, keyWord)).map(item => (
          <li
            key={item.id}
            className="pure-menu-item"
          >
            <Link
              className="pure-menu-link"
              href={makeHref(item)}
              onClick={() => setQueryParam(keyWord)}
            >
              {item.name}
            </Link>
            {item.articles_cnt &&
              <div className={`${styles["article-cnt"]} ${styles[`-rank${item.rank}`]}`}>
                <span>{item.articles_cnt}</span>
                <span className={styles.suffix}>{Number(item.articles_cnt) === 1 ? "Post" : "Posts"}</span>
              </div>
            }
          </li>
        ))}
      </ul>
    </>
  );
}

export default ItemList;