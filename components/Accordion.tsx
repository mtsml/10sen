import { ReactNode, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const getItem = (key: string) => {
  let value = false;
  try {
    console.log(key)
    console.log(sessionStorage.getItem(key))
    console.log(sessionStorage.getItem(key) === "true")
    value = sessionStorage.getItem(key) === "true";
  } catch {
    console.log("SessionStrageが利用できません。");
  }
  return value;
}

const setItem = (key: string, value: boolean) => {
  try {
    sessionStorage.setItem(key, String(value));
  } catch {
    console.log("SessionStrageが利用できません。");
  }
}

interface AccordionProps {
  id: number;
  title: string;
  children: ReactNode;
}

const Accordion = ({ id, title, children }: AccordionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");
  const [isOpen, setIsOpen] = useState(getItem(`accordionIsOpen-${id}`));

  useEffect(() => {
    setIsOpen(getItem(`accordionIsOpen-${id}`))
  }, [id]);

  useEffect(() => {
    if (ref.current) {
      setHeight(isOpen ? `${ref.current.scrollHeight}px` : "0px");
    }
    setItem(`accordionIsOpen-${id}`, isOpen);
  }, [isOpen]);

  const addTransition = () => {
    if (ref.current) {
      ref.current.classList.add("transition");
    }
  }

  const removeTransition = () => {
    if (ref.current) {
      ref.current.classList.add("transition");
    }
  }

  return (
    <div className="accordion">
      <div
        className="accordion-header flex-space-between"
        onClick={() => {
          addTransition();
          setIsOpen(!isOpen);
          removeTransition();
        }}
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