import { useRouter } from 'next/router';
import React from 'react';
import useHover from 'src/hooks/useHover';
import constants from 'src/utils/constants';
const { NAVBAR, PRIMARY_GREEN, TEXT_GRAY } = constants;

export default function ActiveLink({
  children,
  href,
  path,
  type,
  hoverStyle,
  activeStyle,
  customStyle,
}) {
  const router = useRouter();
  const [hoverRef, isHovered] = useHover();

  const isActive = (() => {
    if (type === NAVBAR) {
      return router.asPath.includes(path);
    }
    return router.asPath === href + '/';
  })();

  const getHoverStyle = () => {
    if (!hoverStyle) {
      return { color: PRIMARY_GREEN };
    }
    return { ...hoverStyle, color: isActive ? PRIMARY_GREEN : TEXT_GRAY };
  };

  const getActiveStyle = () => {
    return { ...activeStyle, color: PRIMARY_GREEN };
  };

  const styles = {
    common: {
      textDecoration: 'none',
      cursor: 'pointer',
    },
    normal: {
      color: TEXT_GRAY,
    },
    hover: getHoverStyle(),
    active: getActiveStyle(),
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  const displayedStyle = (() => {
    if (isActive) return styles.active;
    if (isHovered) return styles.hover;
    return styles.normal;
  })();

  return (
    <a
      ref={hoverRef}
      href={href}
      onClick={handleClick}
      style={{ ...displayedStyle, ...styles.common, ...customStyle }}
      className="light-gray-text active-link"
    >
      {children}
    </a>
  );
}
