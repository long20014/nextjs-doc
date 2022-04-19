import { useRouter } from 'next/router';
import constants from '../utils/constants';
import React from 'react';
import useHover from '../hooks/useHover';
const { NAVBAR } = constants;

export default function ActiveLink({ children, href, path, type }) {
  const router = useRouter();
  const [hoverRef, isHovered] = useHover();
  const isActive = (() => {
    if (type === NAVBAR) {
      return router.asPath.includes(path);
    }
    return router.asPath === href;
  })();
  const styles = {
    common: {
      marginRight: 10,
      textDecoration: 'none',
    },
    normal: {
      color: isActive && 'red',
      cursor: 'pointer',
    },
    hover: {
      color: 'hsl(206deg 81% 50%)',
      cursor: 'pointer',
    },
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  const hoverStyle = isHovered ? styles.hover : styles.normal;

  return (
    <a
      ref={hoverRef}
      href={href}
      onClick={handleClick}
      style={{ ...hoverStyle, ...styles.common }}
      className="light-gray-text"
    >
      {children}
    </a>
  );
}
