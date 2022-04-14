import utilStyles from '../styles/utils.module.css';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import ActiveLink from './active-link';
import { useRouter } from 'next/router';
import constants from '../utils/constants';

const { SIDEBAR_LINK } = constants;

export default function NodeTree({ items }) {
  return (
    <ul>
      {items.map((item) => {
        if (!item.items) {
          return (
            <li key={item.name}>
              <ActiveLink href={item.to} path={item.path} type={SIDEBAR_LINK}>
                {item.label}
              </ActiveLink>
            </li>
          );
        } else {
          return <Dropdown item={item} />;
        }
      })}
    </ul>
  );
}

function Dropdown({ item }) {
  const router = useRouter();
  const style = {
    color: router.asPath.includes(`${item.path}/${item.name}`)
      ? 'red'
      : 'black',
  };
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
    <li key={item.name}>
      <div onClick={handleClick} style={style}>
        {expand ? '-' : '+'} {item.label}
      </div>
      <NodeTree items={item.items} />
    </li>
  );
}
