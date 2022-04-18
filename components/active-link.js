import { useRouter } from 'next/router';
import constants from '../utils/constants';
import React from 'react';
const { NAVBAR } = constants;

export default function ActiveLink({ children, href, path, type }) {
  const router = useRouter();
  const isActive = (() => {
    if (type === NAVBAR) {
      return router.asPath.includes(path);
    }
    return router.asPath === href;
  })();
  const style = {
    marginRight: 10,
    color: isActive ? 'red' : 'black',
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  );
}
