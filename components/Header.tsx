import Link from "next/link";

interface HeaderProps {
  breadcrumbs?: Array<{
    href: string;
    label: string;
  }>
}
const Header = ({ breadcrumbs }: HeaderProps) => {
  return (
    <header>
      <Link href="/">楽曲10選</Link>
      {breadcrumbs && breadcrumbs.map(breadcrumb => (
        <small>
          <span className="separator">/</span>
          <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
        </small>
      ))}
    </header>
  );
}

export default Header;