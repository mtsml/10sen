import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

interface ExternalLinkIconProps {
  href: string;
}

const ExternalLinkIcon = ({ href }: ExternalLinkIconProps) => {
  return (
    <a
      className="external-link-icon"
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