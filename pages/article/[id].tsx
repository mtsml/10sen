import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ArticleList, ExternalLinkIcon, Footer, SongList, Tweet } from "@/components";
import { ArticleAPI } from "@/lib";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";

interface ArticleProps {
  id: number;
  url: string;
  name: string;
  tweetUrl: string | null;
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

const Article = ({ id, url, name, tweetUrl, songs, relatedArticles }: ArticleProps) => {
  const title = `${name} - ${SERVICE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:url" content={`${SERVICE_URL}article/${id}`} />
      </Head>
      <h2>
        <span>{name}</span>
      </h2>
      <div className="container">
        <p>
          <a
            className="pure-menu-link"
            href={url}
            target="_blank"
          >
            <span>記事を見る</span>
            <ExternalLinkIcon paddingLeft />
          </a>
        </p>
        {tweetUrl
          && <Tweet
              // 関連記事から遷移した際にコンポーネントを初期化するためにkeyを設定する
              key={tweetUrl}
              url={tweetUrl}
            />
        }
      </div>
      <h3>紹介されている曲</h3>
      <div className="container">
        <SongList songs={songs} />
      </div>
      <h3>同じ曲を紹介している記事</h3>
      <div className="container">
        {relatedArticles.length === 0
          ? <p>同じ曲を紹介している記事はありません。</p>
          : <ArticleList articles={relatedArticles} />
        }
      </div>
      <Footer
        twitterShareText={`「${name}」とその関連記事を見てみよう。`}
        twitterShareUrl={`${SERVICE_URL}article/${id}`}
      />
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

  const { name, url, songs, relatedArticles, tweetUrl } = await ArticleAPI.fetchArticle(Number(id));

  return {
    props: {
      id,
      name,
      url,
      songs,
      relatedArticles,
      tweetUrl
    }
  }
}

export default Article;