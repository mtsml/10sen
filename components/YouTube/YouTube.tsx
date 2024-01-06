import { useState } from "react";
import ContentLoader from "react-content-loader";
import styles from "./YouTube.module.css";

interface YouTubeProps {
  videoId: string;
}

const YouTube = ({ videoId }: YouTubeProps) => {
  const [ isLoading, setIsLoading ] = useState(true);

  return (
    <>
      {isLoading &&
        <div className="content-loader-wrapper">
          <ContentLoader
            className="content-loader"
            speed={2}
            width="100%"
            height="315px"
            style={{ maxWidth: "560px" }}
            foregroundColor="#e7e7e7"
            title="YouTube動画を読み込んでいます。"
          >
            <rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
          </ContentLoader>
        </div>
      }
      <iframe
        className={styles.video}
        width="560"
        height="315"
        style={{ visibility: isLoading ? "hidden" : "visible" }}
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      ></iframe>
    </>
  );
}

export default YouTube;