import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMusic, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Accordion, ArticleList, ExternalLinkIcon, Footer, Information, LinkWithArrow, ItemList } from "@/components";
import { ArticleAPI, SongAPI } from "@/lib";
import type { Article, PopularArtist, PopularSong } from "@/types";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";
import { songToItem, artistToItem } from "@/util/utility";
import styles from "./index.module.css";

type YearProps = {
  year: number;
  articles: Article[];
  popluarArtists: PopularArtist[];
  popularSongs: PopularSong[];
}

const Year = ({ year, articles, popluarArtists, popularSongs }: YearProps) => {
  const title = `${year}年 - ${SERVICE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:url" content={`${SERVICE_URL}year/${year}`} />
      </Head>
      <div className="container">
        <h2 className={styles.title}>
          <FontAwesomeIcon
            className={styles.icon}
            icon={faMusic}
          />
          <span>
            {year}年の人気曲
          </span>
        </h2>
        <ItemList
          items={popularSongs.map(songToItem)}
          makeHref={(item) => `/song/${encodeURIComponent(item.id)}`}
        />
        <div className={styles.linkWrapper}>
          <LinkWithArrow
            href={`/year/${encodeURIComponent(year)}/songs`}
            text={`${year}年に紹介されたすべての曲を見る`}
          />
        </div>
      </div>
      <div className="container">
        <h2 className={styles.title}>
          <FontAwesomeIcon
            className={styles.icon}
            icon={faMicrophone}
          />
          <span>
            {year}年の人気歌手
          </span>
        </h2>
        <Accordion
          header="遷移先と集計方法"
        >
          <p>歌手名をクリックすると曲の一覧ページに遷移します。一覧ページは歌手名で曲を絞り込んだ状態で表示されます。</p>
          <p>歌手名の横に表示されている Post(s) はその歌手を紹介している<b>記事数</b>です。一つの記事で同じ歌手の曲を複数紹介している場合でも1回とカウントします。</p>
        </Accordion>
        <ItemList
          items={popluarArtists.map(artistToItem)}
          makeHref={(item) => ({
            pathname: `/year/${year}/songs`,
            query: {
              keyword: item.name
            }
          })}
        />
        <div className={styles.linkWrapper}>
          <LinkWithArrow
            href={`/year/${encodeURIComponent(year)}/artists`}
            text={`${year}年に紹介されたすべての歌手を見る`}
          />
        </div>
      </div>
      <div className="container">
        <h2 className={styles.title}>
          <FontAwesomeIcon
            className={styles.icon}
            icon={faPenToSquare}
          />
          <span>
            {year}年の記事一覧
          </span>
        </h2>
        <div className={styles.information}>
          <Information>
            <ExternalLinkIcon paddingRight />
            <span>
              をクリックすると記事（外部サイト）を開きます。
            </span>
          </Information>
        </div>
        <ArticleList articles={articles} />
      </div>
      <Footer
        twitterShareText={`${year}年の楽曲10選を紹介している${articles.length}件の記事があります。`}
        twitterShareUrl={`${SERVICE_URL}year/${year}`}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const years = await ArticleAPI.fetchYears();

  const paths = years.map(year => {
    return {
      params: {
        year: String(year)
      }
    }
  });

  return {
    paths,
    fallback: "blocking"
  }
}
  
export const getStaticProps: GetStaticProps = async (context) => {
  const year = context.params && context.params.year;

  const result = await Promise.all([
    ArticleAPI.fetchArticlesByYear(Number(year)),
    SongAPI.fetchPopularArtistsByYear(Number(year)),
    SongAPI.fetchPopularSongsByYear(Number(year))
  ]);
  const [ articles, popluarArtists, popularSongs ] = result;

  return {
    props: {
      year,
      articles,
      popluarArtists,
      popularSongs
    }
  }
}

export default Year;