import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Imformation from "@/components/Information/Information";
import ArticleList from "@/components/ArticleList/ArticleList";
import SongList from "@/components/SongList/SongList";
import TwitterShareLink from "@/components/TwitterShareLink/TwitterShareLink";
import ArticleAPI from "@/lib/ArticleAPI";
import SongAPI from "@/lib/SongAPI";
import Article from "@/types/article";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";

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
  const title = `${year}年 - ${SERVICE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:url" content={`${SERVICE_URL}year/${year}`} />
      </Head>
      <h2>{year}年の記事</h2>
      <div className="container">
        <Imformation>
          <FontAwesomeIcon
            className="icon external-link-icon -inline"
            icon={faUpRightFromSquare}
          />
          <span>
            をクリックすると記事（外部サイト）を開きます。
          </span>
        </Imformation>
        <ArticleList articles={articles} />
      </div>
      <h2>{year}年の人気曲</h2>
      <div className="container">
        <SongList songs={popularSongs} />
        <p className="pt-05">
          <Link
            className="pure-menu-link"
            href={`/year/${encodeURIComponent(year)}/songs`}
          >
            {year}年に紹介されたすべての曲を見る<FontAwesomeIcon className="icon -inline" icon={faArrowRight} />
          </Link>
        </p>
      </div>
      <div className="container flex-center mb-1">
        <TwitterShareLink
          text={`${year}年の楽曲10選を紹介している${articles.length}件の記事があります。`}
          url={`${SERVICE_URL}year/${year}`}
          hashtags={["楽曲10選まとめ"]}
        />
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