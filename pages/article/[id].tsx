import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import ArticleList from "@/components/ArticleList";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import SongList from "@/components/SongList";
import ArticleAPI from "@/lib/ArticleAPI";
import { SERVICE_NAME } from "@/util/const";

interface ArticleProps {
  url: string;
  name: string;
  songs: Array<{
    song_id: number,
    song_name: string,
    artist_id: number,
    artist_name: string
  }>;
  relatedArticles: Array<{
    id: number;
    url: string;
    name: string;
    songs_cnt: number;
    songs_name: string;
  }>;
}

const Article = ({ url, name, songs, relatedArticles }: ArticleProps) => {
  return (
    <>
      <Head>
        <title>{name} - {SERVICE_NAME}</title>
      </Head>
      <h2 className="flex-space-between">
        <span>{name}</span>
        <ExternalLinkIcon href={url} />
      </h2>
      <div className="container">
        <SongList songs={songs} />
      </div>
      <h2>関連記事</h2>
      <div className="container">
        <ArticleList articles={relatedArticles} />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await ArticleAPI.fetchArticles();

  const paths = articles.map(article => {
    return {
      params: {
        id: String(article.id)
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

  const { name, url, songs, relatedArticles } = await ArticleAPI.fetchArticle(Number(id));

  return {
    props: {
      name,
      url,
      songs,
      relatedArticles
    }
  }
}

export default Article;