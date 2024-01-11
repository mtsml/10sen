import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { Footer, ItemList } from "@/components";
import { ArticleAPI, SongAPI } from "@/lib";
import type { Artist } from "@/types";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";
import { artistToItem } from "@/util/utility";
import styles from "./index.module.css";

type ArtistsProps = {
  year: number;
  artists: Artist[];
}

const Artists = ({ year, artists }: ArtistsProps) => {
  const title = `${year}年に紹介された歌手 - ${SERVICE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:url" content={`${SERVICE_URL}year/${year}/artists`} />
      </Head>
      <h2>
        <FontAwesomeIcon
          className={styles.icon}
          icon={faMicrophone}
        />
        <span>
          {year}年に紹介された歌手
        </span>
      </h2>
      <div className="container">
        <ItemList
          items={artists.map(artistToItem)}
          makeHref={(item) => ({
            pathname: `/year/${year}/songs`,
            query: {
              keyword: item.name
            }
          })}
          search
          searchPlaceholder="歌手名を入力してください"
        />
      </div>
      <Footer
        twitterShareText={`${year}年の楽曲10選記事では${artists.length}人の歌手が紹介されています。`}
        twitterShareUrl={`${SERVICE_URL}year/${year}/artists`}
      />
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

  const artists = await SongAPI.fetchPopularArtistsByYear(Number(year), 999);

  return {
    props: {
      year,
      artists
    }
  }
}

export default Artists;