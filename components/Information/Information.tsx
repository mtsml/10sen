import { ReactNode } from "react";
import styles from "./Information.module.css";

interface InformationProps {
  children: ReactNode;
}

const Information = ({ children }: InformationProps) => {
  return (
    <div className={styles.information}>
      {children}
    </div>
  );
}

export default Information;