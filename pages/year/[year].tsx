import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Header from "@/components/Header";
import ArticleList from "@/components/ArticleList";
import SongList from "@/components/SongList";
import ArticleAPI from "@/lib/ArticleAPI";
import SongAPI from "@/lib/SongAPI";
import Article from "@/types/article";

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
        <title>{year}年 - 楽曲10選</title>
      </Head>
      <Header
        breadcrumbs={[ { href: `/year/${year}`, label: `${year}年` } ]}
      />
      <main>
        <h2>紹介記事</h2>
        <div
          className="container"
        >
          <ArticleList
            articles={articles}
          />
        </div>
        <h2>たくさん言及されている曲</h2>
        <div
          className="container"
        >
          <SongList
            songs={popularSongs}
          />
        </div>
      </main>
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