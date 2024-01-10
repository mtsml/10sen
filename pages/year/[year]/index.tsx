import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ArticleList, ExternalLinkIcon, Footer, Information, LinkWithArrow, ItemList } from "@/components";
import { ArticleAPI, SongAPI } from "@/lib";
import type { Article, PopularArtist, PopularSong } from "@/types";
import { SERVICE_NAME, SERVICE_URL } from "@/util/const";
import { songToItem, artistToItem } from "@/util/utility";

type YearProps = {
  year: number;
  articles: Article[];
  popluarArtists: PopularArtist[];
  popularSongs: PopularSong[];
}

const Year = ({ year, articles, popluarArtists, popularSongs }: YearProps) => {
  const title = `${year}年 - ${SERVICE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:url" content={`${SERVICE_URL}year/${year}`} />
      </Head>
      <h2>{year}年の人気曲</h2>
      <div className="container">
        <ItemList
          items={popularSongs.map(songToItem)}
          makeHref={(item) => `/song/${encodeURIComponent(item.id)}`}
        />
        <p>
          <LinkWithArrow
            href={`/year/${encodeURIComponent(year)}/songs`}
            text={`${year}年に紹介されたすべての曲を見る`}
          />
        </p>
      </div>
      <h2>{year}年の人気歌手</h2>
      <div className="container">
        <ItemList
          items={popluarArtists.map(artistToItem)}
          makeHref={(item) => ({
            pathname: `/year/${year}/songs`,
            query: {
              keyword: item.name
            }
          })}
        />
        <p>
          <LinkWithArrow
            href={`/year/${encodeURIComponent(year)}/artists`}
            text={`${year}年に紹介されたすべての歌手を見る`}
          />
        </p>
      </div>
      <h2>{year}年の記事</h2>
      <div className="container">
        <Information>
          <ExternalLinkIcon paddingRight />
          <span>
            をクリックすると記事（外部サイト）を開きます。
          </span>
        </Information>
        <ArticleList articles={articles} />
      </div>
      <Footer
        twitterShareText={`${year}年の楽曲10選を紹介している${articles.length}件の記事があります。`}
        twitterShareUrl={`${SERVICE_URL}year/${year}`}
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

  const result = await Promise.all([
    ArticleAPI.fetchArticlesByYear(Number(year)),
    SongAPI.fetchPopularArtistsByYear(Number(year)),
    SongAPI.fetchPopularSongsByYear(Number(year))
  ]);
  const [ articles, popluarArtists, popularSongs ] = result;

  return {
    props: {
      year,
      articles,
      popluarArtists,
      popularSongs
    }
  }
}

export default Year;