import React, { useState, useEffect } from 'react';
import ActiveLink from './active-link';
import { useRouter } from 'next/router';
import constants from 'src/utils/constants';
import useHover from 'src/hooks/useHover';
import classNames from 'classnames';
const { SIDEBAR_LINK, PRIMARY_GREEN, TEXT_GRAY, BACKGROUND_GRAY } = constants;

export default function Root({ items }) {
  return (
    <div className="node-tree expanded">
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
              <ActiveLink
                href={item.to}
                path={item.path}
                type={SIDEBAR_LINK}
                hoverStyle={{ backgroundColor: BACKGROUND_GRAY }}
                customStyle={{
                  padding: '3px 0.5em',
                  borderRadius: '5px',
                  width: '100%',
                  display: 'inline-block',
                }}
                activeStyle={{
                  backgroundColor: BACKGROUND_GRAY,
                }}
              >
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
      color: isActive ? PRIMARY_GREEN : TEXT_GRAY,
    },
    hover: {
      color: isActive ? PRIMARY_GREEN : TEXT_GRAY,
      backgroundColor: BACKGROUND_GRAY,
    },
  };

  const [expanded, setExpanded] = useState(item.isExpanded);

  const handleClick = (target) => {
    setExpanded((expanded) => !expanded);
    if (!expanded) {
      target.parentNode.classList.add('expanded');
    } else {
      target.parentNode.classList.remove('expanded');
    }
  };

  useEffect(() => {
    if (isActive) {
      if (!expanded) {
        handleClick(hoverRef.current);
      }
    }
  }, [router.asPath]);

  return (
    <li className={classNames({ expanded: item.isExpanded })}>
      <div
        ref={hoverRef}
        onClick={(e) => handleClick(hoverRef.current)}
        style={{
          ...(isHovered ? styles.hover : styles.normal),
          ...styles.common,
        }}
        className="sidebar-item light-gray-text dropdown-label"
      >
        <span className="label-text">{item.label}</span>
      </div>
      <NodeTree items={item.items} />
    </li>
  );
}
