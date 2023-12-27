import { ReactNode, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const Accordion = ({ title, children }: AccordionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setHeight(isOpen ? `${ref.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div className="accordion">
      <div
        className="accordion-header flex-space-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <FontAwesomeIcon
          icon={isOpen ? faMinus : faPlus}
          size="lg"
        />
      </div>
      <div
        ref={ref}
        className="accordion-body"
        style={{ maxHeight: height }}
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;