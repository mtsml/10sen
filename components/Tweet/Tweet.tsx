import { useEffect, useRef, useState } from "react";
import ContentLoader from "react-content-loader";
import styles from "./Tweet.module.css";

interface TweetProps {
  url: string;
}

const Tweet = ({ url }: TweetProps) => {
  const [ isLoading, setIsLoading ] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://platform.twitter.com/widgets.js";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.removedNodes.length !== 0) {
          mutation.removedNodes.forEach(node => {
            if ((node as Element).classList.contains("twitter-tweet")) {
              setIsLoading(false);
            }
          });
        }
      }
    });
    ref.current && observer.observe(ref.current, { childList: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.tweet}>
      {isLoading &&
        <div className="content-loader-wrapper">
          <ContentLoader
            className="content-loader"
            speed={2}
            width="100%"
            height="600px"
            style={{ maxWidth: "550px" }}
            title="Xポストを読み込み中です。"
          >
            <circle cx="40" cy="35" r="27" />
            <rect x="70" y="18" rx="2" ry="2" width="100" height="16" />
            <rect x="70" y="40" rx="2" ry="2" width="80" height="16" />
            <rect x="0" y="70" rx="12" ry="12" width="100%" height="530" />
          </ContentLoader>
        </div>
      }
      <div
        ref={ref}
        style={{
          visibility: isLoading ? "hidden" : "visible",
          height: isLoading ? "600px" : "inherit"
        }}
      >
        <blockquote className="twitter-tweet">
          <a href={url}></a>
        </blockquote>
      </div>
    </div>
  );
}

export default Tweet;