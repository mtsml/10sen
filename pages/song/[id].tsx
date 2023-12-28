import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import ArticleList from "@/components/ArticleList";
import ArticleAPI from "@/lib/ArticleAPI";
import SongAPI from "@/lib/SongAPI";
import Article from "@/types/article";
import { SERVICE_NAME } from "@/util/const";

interface SongProps {
  song_name: string;
  artist_name: string;
  video_id: string | null;
  articles: Array<Article>;
}

const Song = ({ song_name, artist_name, video_id, articles }: SongProps) => {
  return (
    <>
      <Head>
        <title>{song_name} / {artist_name} - {SERVICE_NAME}</title>
      </Head>
      <h2>{song_name} / {artist_name}</h2>
      <div className="container">
        {video_id
          ? <iframe
              className="video"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video_id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
          ></iframe>
          : "視聴動画を準備中です。"
        }
      </div>
      <h3>この曲を紹介している記事</h3>
      <div className="container">
        <ArticleList articles={articles} />
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
      song_name,
      artist_name,
      video_id,
      articles
    }
  }
}

export default Song;