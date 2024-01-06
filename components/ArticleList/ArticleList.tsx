import Link from "next/link";
import { ExternalLinkIcon } from "@/components";
import type { Article } from "@/types";

interface ArticleWithRelatedSongs extends Article {
  songs_name?: string;
}

interface ArticleListProps {
  articles: ArticleWithRelatedSongs[];
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
            {article.songs_name
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