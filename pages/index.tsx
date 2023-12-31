import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ArticleAPI from "@/lib/ArticleAPI";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";

interface HomeProps {
  years: number[];
}

const Home = ({ years }: HomeProps) => {
  return (
    <>
      <Head>
        <title>{SERVICE_NAME}</title>
        <meta name="og:title" content={SERVICE_NAME} />
        <meta name="og:url" content={SERVICE_URL} />
      </Head>
      <div className="container">
        <p>楽曲10選まとめは楽曲10選をまとめます。</p>
      </div>
      <div className="container">
        <ul className="pure-menu">
          {years.map(year => (
            <li
              key={year}
              className="pure-menu-item flex-space-between"
            >
              <Link
                className="pure-menu-link"
                href={`/year/${encodeURIComponent(year)}`}
              >
                {year}年の記事を見る<FontAwesomeIcon className="icon -inline" icon={faArrowRight} />
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