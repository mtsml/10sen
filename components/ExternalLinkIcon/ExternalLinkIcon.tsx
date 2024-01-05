import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "./ExternalLinkIcon.module.css";

interface ExternalLinkIconProps {
  href: string;
}

const ExternalLinkIcon = ({ href }: ExternalLinkIconProps) => {
  return (
    <a
      className={styles["external-link-icon"]}
      href={href}
      target="_blank"
    >
      <FontAwesomeIcon
        icon={faUpRightFromSquare}
      />
    </a>
  );
}

export default ExternalLinkIcon;