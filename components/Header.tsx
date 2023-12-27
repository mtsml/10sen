import Link from "next/link";
import { SERVICE_NAME } from "@/util/const";

const Header = () => {
  return (
    <header>
      <Link href="/">{SERVICE_NAME}</Link>
    </header>
  );
}

export default Header;