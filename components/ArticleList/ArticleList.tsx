import Link from "next/link";
import { ExternalLinkIcon } from "@/components";
import type { Article, RelatedArticle } from "@/types";

const isRelatedArticle = (article: Article | RelatedArticle): article is RelatedArticle => {
  return "songs_name" in article;
}

type ArticleListProps = {
  articles: Article[] | RelatedArticle[];
}

const ArticleList = ({ articles }: ArticleListProps) => {
  return (
    <ul className="pure-menu">
      {articles.map(article => (
        <li
          key={article.id}
          className="pure-menu-item"
        >
          <Link
            className="pure-menu-link"
            href={`/article/${encodeURIComponent(article.id)}`}
          >
            {isRelatedArticle(article)
              ? <>{article.name}<br/><small>( {article.songs_name} )</small></>
              : article.name
            }
          </Link>
          <ExternalLinkIcon
            href={article.url}
            paddingLeft
          />
        </li>
      ))}
    </ul>
  );
}

export default ArticleList;