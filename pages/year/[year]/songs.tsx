import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import SongList from "@/components/SongList/SongList";
import TwitterShareLink from "@/components/TwitterShareLink/TwitterShareLink";
import ArticleAPI from "@/lib/ArticleAPI";
import SongAPI from "@/lib/SongAPI";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";

interface SongsProps {
  year: number;
  songs: Array<{
    song_id: number;
    song_name: string;
    artist_name: string;
    articles_cnt: number;
  }>
}

const Songs = ({ year, songs }: SongsProps) => {
  const title = `${year}年に紹介された曲 - ${SERVICE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:url" content={`${SERVICE_URL}year/${year}/songs`} />
      </Head>
      <h2>{year}年に紹介された曲</h2>
      <div className="container">
        <SongList songs={songs} />
      </div>
      <div className="container flex-center mb-1">
        <TwitterShareLink
          text={`${year}年の楽曲10選記事では${songs.length}曲が紹介されています。`}
          url={`${SERVICE_URL}year/${year}/songs`}
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

  const songs = await SongAPI.fetchPopularSongsByYear(Number(year), 999);

  return {
    props: {
      year,
      songs
    }
  }
}

export default Songs;