import { GetStaticProps } from "next";
import Head from "next/head";
import { Footer, LinkWithArrow } from "@/components";
import { ArticleAPI } from "@/lib";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";

type HomeProps = {
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
              className="pure-menu-item"
            >
              <LinkWithArrow
                href={`/year/${encodeURIComponent(year)}`}
                text={`${year}年の記事を見る`}
              />
            </li>
          ))}
        </ul>
      </div>
      <Footer
        twitterShareText="楽曲10選がまとめられています。"
        twitterShareUrl={SERVICE_URL}
      />
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