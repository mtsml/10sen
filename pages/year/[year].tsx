import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import ArticleList from "@/components/ArticleList";
import Accordion from "@/components/Accordion";
import SongList from "@/components/SongList";
import ArticleAPI from "@/lib/ArticleAPI";
import SongAPI from "@/lib/SongAPI";
import Article from "@/types/article";
import { SERVICE_NAME } from "@/util/const";

interface YearProps {
  year: number;
  articles: Article[];
  popularSongs: Array<{
    song_id: number;
    song_name: string;
    artist_name: string;
    articles_cnt: number;
  }>
}

const Year = ({ year, articles, popularSongs }: YearProps) => {
  return (
    <>
      <Head>
        <title>{year}年 - {SERVICE_NAME}</title>
      </Head>
      <h2>{year}年の記事一覧</h2>
      <div className="container">
        <Accordion title="リンクをクリックする前に">
          <p>記事名をクリックすると選曲・関連記事が表示されます。ネタバレを踏みたくない場合は外部リンクアイコン<FontAwesomeIcon className="external-link-icon -inline" icon={faUpRightFromSquare} />をクリックして直接記事へアクセスしてください。</p>
        </Accordion>
        <ArticleList articles={articles} />
      </div>
      <h2>{year}年の人気曲</h2>
      <div className="container">
        <SongList songs={popularSongs} />
      </div>
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
    SongAPI.fetchPopularSongsByYear(Number(year))
  ]);
  const [ articles, popularSongs ] = result;

  return {
    props: {
      year,
      articles,
      popularSongs
    }
  }
}

export default Year;