import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "./ExternalLinkIcon.module.css";

interface ExternalLinkIconProps {
  href?: string;
  paddingRight?: boolean;
  paddingLeft?: boolean;
}

const ExternalLinkIcon = ({ href, paddingRight = false, paddingLeft = false }: ExternalLinkIconProps) => {
  const classNames = [styles["external-link-icon"]];
  paddingRight && classNames.push(styles["padding-right"]);
  paddingLeft && classNames.push(styles["padding-left"]);
  const className = classNames.join(" ");

  return href
    ? <a
        href={href}
        target="_blank"
      >
        <FontAwesomeIcon
          className={className}
          icon={faUpRightFromSquare}
        />
      </a>
    : <FontAwesomeIcon
        className={className}
        icon={faUpRightFromSquare}
      />
}

export default ExternalLinkIcon;