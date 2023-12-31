import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

interface TwitterShareLinkProps {
  text: string; 
  url: string;
  hashtags: string[];
}

const TwitterShareLink = ({ text, url, hashtags }: TwitterShareLinkProps) => {
  const createTweetUrl = new URL("https://twitter.com/intent/tweet");
  createTweetUrl.searchParams.set("text", text);
  createTweetUrl.searchParams.set("url", url);
  createTweetUrl.searchParams.set("hashtags", hashtags.join(","));

  return (
    <a
      className="pure-menu-link"
      href={createTweetUrl.toString()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        className="twitter-share-icon"
        icon={faXTwitter}
      />
      <span>共有する</span>
    </a>
  )
}

export default TwitterShareLink;