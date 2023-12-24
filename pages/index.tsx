import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header";
import ArticleAPI from "@/lib/ArticleAPI";

interface HomeProps {
  years: number[];
}

const Home = ({ years }: HomeProps) => {
  return (
    <>
      <Head>
        <title>楽曲10選</title>
      </Head>
      <Header />
      <main>
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
      </main>
    </>
  )
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