import utilStyles from '../styles/utils.module.css';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import ActiveLink from './active-link';

export default function NodeTree({ items }) {
  return (
    <ul>
      {items.map((item) => {
        if (!item.items) {
          return (
            <li>
              <ActiveLink key={`/${item.path}`} href={`/${item.path}`}>
                {item.label}
              </ActiveLink>
            </li>
          );
        } else {
          return <Dropdown key={item.label} item={item} />;
        }
      })}
    </ul>
  );
}

function Dropdown({ item }) {
  const [expand, setExpand] = useState(false);

  const handleClick = (e) => {
    setExpand((expand) => !expand);
    if (!expand) {
      e.target.parentNode.classList.add('expand');
    } else {
      e.target.parentNode.classList.remove('expand');
    }
  };

  return (
    <li>
      <div onClick={handleClick}>
        {expand ? '-' : '+'} {item.label}
      </div>
      <NodeTree items={item.items} />
    </li>
  );
}
