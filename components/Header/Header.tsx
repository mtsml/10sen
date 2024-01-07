import Link from "next/link";
import { SERVICE_NAME } from "@/util/const";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">{SERVICE_NAME}</Link>
    </header>
  );
}

export default Header;