import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { Footer, SongList } from "@/components";
import { ArticleAPI, SongAPI } from "@/lib";
import type { Song } from "@/types";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";

type SongsProps = {
  year: number;
  songs: Song[];
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
      <Footer
        twitterShareText={`${year}年の楽曲10選記事では${songs.length}曲が紹介されています。`}
        twitterShareUrl={`${SERVICE_URL}year/${year}/songs`}
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

  const songs = await SongAPI.fetchPopularSongsByYear(Number(year), 999);

  return {
    props: {
      year,
      songs
    }
  }
}

export default Songs;