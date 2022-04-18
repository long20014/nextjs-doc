import Link from 'next/link';
import React from 'react';

export default function NormalLink({ href, children, style, classNames }) {
  return (
    <Link href={href}>
      <a style={style} className={classNames}>
        {children}
      </a>
    </Link>
  );
}
