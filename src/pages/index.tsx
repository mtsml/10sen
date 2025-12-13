import { GetStaticProps } from "next";
import Head from "next/head";
import { Footer, Information, LinkWithArrow } from "@/components";
import { ArticleAPI } from "@/lib";
import { CONTACT_US_X_ID, CONTACT_US_X_LINK, SERVICE_NAME, SERVICE_URL } from "@/util/const";
import styles from "./index.module.css";

type HomeProps = {
  years: number[];
}

const Home = ({ years }: HomeProps) => {
  return (
    <>
      <Head>
        <title>{SERVICE_NAME}</title>
        <meta property="og:title" content={SERVICE_NAME} />
        <meta property="og:url" content={SERVICE_URL} />
      </Head>
      <div className="container">
        <div className={styles.description}>
          <p>楽曲10選まとめは楽曲10選をまとめます。</p>
        </div>
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
      <div className={styles.information}>
        <Information>
          <span>記事の追加や削除のご要望、不具合や改善に関するご意見、その他お問合わせは</span>
          <a
            className="pure-menu-link"
            href={CONTACT_US_X_LINK}
            target="_blank"
          >
            {CONTACT_US_X_ID}
          </a>
          <span>までご連絡ください。</span>
        </Information>
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