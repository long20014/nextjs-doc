import React from 'react';
import { useRouter } from 'next/router';

export default function NormalLink({ href, children, style, classNames }) {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };
  return (
    <a href={href} onClick={handleClick} style={style} className={classNames}>
      {children}
    </a>
  );
}
