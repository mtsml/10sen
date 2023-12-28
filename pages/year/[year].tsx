import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import ArticleList from "@/components/ArticleList";
import SongList from "@/components/SongList";
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