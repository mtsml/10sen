import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

interface TweetProps {
  url: string;
}

const Tweet = ({ url }: TweetProps) => {
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(()=>{
    const script = document.createElement('script');
    script.src = "https://platform.twitter.com/widgets.js";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="mb-1">
      {isLoading
        ? <ContentLoader
            speed={2}
            width="100%"
            height="300px"
            style={{ maxWidth: "550px" }}
            title="Xポストを読み込み中です。"
          >
            <rect x="0" y="0" rx="12" ry="12" width="100%" height="300" />
          </ContentLoader>
        : <blockquote className="twitter-tweet">
            <a href={url}></a>
          </blockquote>
      }
    </div>
  );
}

export default Tweet;