import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ArticleList, Footer, YouTube } from "@/components";
import { ArticleAPI, SongAPI } from "@/lib";
import type { Article, Song } from "@/types";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";

type SongProps = Song & {
  articles: Article[];
}

const Song = ({ song_id, song_name, artist_name, video_id, articles }: SongProps) => {
  const title = `${song_name} / ${artist_name} - ${SERVICE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:url" content={`${SERVICE_URL}song/${song_id}`} />
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
      <Footer
        twitterShareText={`${artist_name}の${song_name}を紹介している${articles.length}件の記事があります。`}
        twitterShareUrl={`${SERVICE_URL}song/${song_id}`}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const songs = await SongAPI.fetchAllSongIds();

  const paths = songs.map(song => {
    return {
      params: {
        id: String(song.song_id)
      }
    }
  });

  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const song_id = context.params && context.params.id;

  const result = await Promise.all([
    SongAPI.fetchSong(Number(song_id)),
    ArticleAPI.fetchArticlesBySong(Number(song_id))
  ]);
  const [{ song_name, artist_name, video_id }, articles] = result;

  return {
    props: {
      song_id,
      song_name,
      artist_name,
      video_id,
      articles
    }
  }
}

export default Song;