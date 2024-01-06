import { TwitterShareLink } from "@/components";
import styles from "./Footer.module.css";

interface FooterProps {
  twitterShareText: string;
  twitterShareUrl: string;
}

const Footer = ({ twitterShareText, twitterShareUrl }: FooterProps) => {
  return (
    <div className={`${styles.footer} container`}>
      <TwitterShareLink
        text={twitterShareText}
        url={twitterShareUrl}
        hashtags={["楽曲10選まとめ"]}
      />
    </div>
  );
}

export default Footer;