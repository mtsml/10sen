import { ReactNode, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Accordion.module.css";

type AccordionProps = {
  header: ReactNode;
  children: ReactNode;
  type?: "information" | "warning";
}

const Accordion = ({ header, type = "information", children }: AccordionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setHeight(isOpen ? `${ref.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div className={`${styles.accordion} ${styles[type]}`}>
      <div
        className={styles["accordion-header"]}
        onClick={() => setIsOpen(!isOpen)}
      >
        {header}
        <FontAwesomeIcon
          icon={isOpen ? faMinus : faPlus}
          size="lg"
        />
      </div>
      <div
        ref={ref}
        className={styles["accordion-body"]}
        style={{ maxHeight: height }}
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;