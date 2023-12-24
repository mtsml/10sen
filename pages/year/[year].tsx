import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Header from "@/components/Header";
import ArticleList from "@/components/ArticleList";
import ArticleAPI from "@/lib/ArticleAPI";
import Article from "@/types/article";

interface YearProps {
  year: number;
  articles: Article[];
}

const Year = ({ year, articles }: YearProps) => {
  return (
    <>
      <Head>
        <title>{year}年 - 楽曲10選</title>
      </Head>
      <Header />
      <main>
        <h2>{year}年</h2>
        <div
          className="container"
        >
          <ArticleList
            articles={articles}
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

  const articles = await ArticleAPI.fetchArticles(Number(year), undefined, undefined);

  return {
    props: {
      year,
      articles
    }
  }
}

export default Year;