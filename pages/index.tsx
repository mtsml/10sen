import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import ArticleAPI from "@/lib/ArticleAPI";
import { SERVICE_NAME } from "@/util/const";

interface HomeProps {
  years: number[];
}

const Home = ({ years }: HomeProps) => {
  return (
    <>
      <Head>
        <title>{SERVICE_NAME}</title>
      </Head>
      <div className="container">
        <p>楽曲10選まとめは楽曲10選をまとめるサービスです。</p>
      </div>
      <div className="year-container">
        <ul className="pure-menu">
          {years.map(year => (
            <li
              key={year}
              className="pure-menu-item"
            >
              <Link
                className="pure-menu-link"
                href={`/year/${encodeURIComponent(year)}`}
              >
                {year}年
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const years = await ArticleAPI.fetchYears();

  return {
    props: {
      years
    }
  }
}

export default Home;