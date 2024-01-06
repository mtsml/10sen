import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./LinkWithArrow.module.css";

interface LinkWithArrowProps {
  href: string;
  text: string;
}

const LinkWithArrow = ({ href, text }: LinkWithArrowProps) => {
  return (
    <Link
      className="pure-menu-link"
      href={href}
    >
      <span>{text}</span>
      <FontAwesomeIcon
        className={styles.icon}
        icon={faArrowRight}
      />
    </Link>
  );
}

export default LinkWithArrow;