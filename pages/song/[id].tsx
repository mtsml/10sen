import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ArticleList, TwitterShareLink, YouTube } from "@/components";
import { ArticleAPI, SongAPI } from "@/lib";
import type { Article } from "@/types";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";

interface SongProps {
  id: number;
  song_name: string;
  artist_name: string;
  video_id: string | null;
  articles: Array<Article>;
}

const Song = ({ id, song_name, artist_name, video_id, articles }: SongProps) => {
  const title = `${song_name} / ${artist_name} - ${SERVICE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:url" content={`${SERVICE_URL}song/${id}`} />
      </Head>
      <h2>{song_name} / {artist_name}</h2>
      <div className="container">
        {video_id
          ? <YouTube videoId={video_id} />
          : <p>視聴動画を準備中です。</p>
        }
      </div>
      <h3>この曲を紹介している記事</h3>
      <div className="container">
        <ArticleList articles={articles} />
      </div>
      <div className="container flex-center mb-1">
        <TwitterShareLink
          text={`${artist_name}の${song_name}を紹介している${articles.length}件の記事があります。`}
          url={`${SERVICE_URL}song/${id}`}
          hashtags={["楽曲10選まとめ"]}
        />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const songs = await SongAPI.fetchSongs();

  const paths = songs.map(song => {
    return {
      params: {
        id: String(song.id)
      }
    }
  });

  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params && context.params.id;

  const result = await Promise.all([
    SongAPI.fetchSong(Number(id)),
    ArticleAPI.fetchArticlesBySong(Number(id))
  ]);
  const [{ song_name, artist_name, video_id }, articles] = result;

  return {
    props: {
      id,
      song_name,
      artist_name,
      video_id,
      articles
    }
  }
}

export default Song;