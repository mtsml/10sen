import Link from "next/link";

interface ListProps {
  linkPrefix: string;
  items: Array<{
    id: number;
    name: string;
  }>;
}

const List = ({ linkPrefix, items }: ListProps) => {
  return (
    <ul className="pure-menu">
      {items.map(item => (
        <li key={item.id} className="pure-menu-item">
          <Link
            className="pure-menu-link"
            href={`${linkPrefix}${encodeURIComponent(item.id)}`}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default List;