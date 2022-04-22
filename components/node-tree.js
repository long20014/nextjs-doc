import React, { useState, useEffect } from 'react';
import ActiveLink from './active-link';
import { useRouter } from 'next/router';
import constants from '../utils/constants';
import useHover from '../hooks/useHover';

const { SIDEBAR_LINK } = constants;

export default function NodeTree({ items }) {
  return (
    <ul>
      {items.map((item) => {
        if (!item.items) {
          return (
            <li key={item.to}>
              <ActiveLink href={item.to} path={item.path} type={SIDEBAR_LINK}>
                {item.label}
              </ActiveLink>
            </li>
          );
        }
        return <Dropdown key={item.name} item={item} />;
      })}
    </ul>
  );
}

function Dropdown({ item }) {
  const router = useRouter();
  const [hoverRef, isHovered] = useHover();
  const styles = {
    common: {
      cursor: 'pointer',
    },
    normal: {
      color: router.asPath.includes(`${item.path}/${item.name}`)
        ? 'red'
        : '#82888f',
    },
    hover: {
      color: 'hsl(206deg 81% 50%)',
    },
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

  useEffect(() => {}, [router.asPath]);

  return (
    <li>
      <div
        ref={hoverRef}
        onClick={handleClick}
        style={{
          ...(isHovered ? styles.hover : styles.normal),
          ...styles.common,
        }}
        className="sidebar-item light-gray-text"
      >
        {expand ? '-' : '+'} {item.label}
      </div>
      <NodeTree items={item.items} />
    </li>
  );
}
