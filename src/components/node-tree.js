import React, { useState, useEffect } from 'react';
import ActiveLink from './active-link';
import { useRouter } from 'next/router';
import constants from 'src/utils/constants';
import useHover from 'src/hooks/useHover';
import classNames from 'classnames';

const { SIDEBAR_LINK } = constants;

export default function Root({ items }) {
  return (
    <div className="node-tree expand">
      <NodeTree items={items} />
    </div>
  );
}

function NodeTree({ items }) {
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
  const isActive = (() => {
    return router.asPath.includes(`${item.path}/${item.name}`);
  })();
  const styles = {
    common: {
      cursor: 'pointer',
    },
    normal: {
      color: isActive ? 'red' : '#82888f',
    },
    hover: {
      color: 'hsl(206deg 81% 50%)',
    },
  };

  const [expand, setExpand] = useState(item.isExpanded);

  const handleClick = (target) => {
    setExpand((expand) => !expand);
    if (!expand) {
      target.parentNode.classList.add('expand');
    } else {
      target.parentNode.classList.remove('expand');
    }
  };

  useEffect(() => {
    if (isActive) {
      if (!expand) {
        handleClick(hoverRef.current);
      }
    }
  }, [router.asPath]);

  return (
    <li className={classNames({ expand: item.isExpanded })}>
      <div
        ref={hoverRef}
        onClick={(e) => handleClick(e.target)}
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
