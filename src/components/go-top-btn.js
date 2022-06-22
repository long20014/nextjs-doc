import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';

const OFFSET = 65;

export default function GoTopButton() {
  const [hide, setHide] = useState(false);
  const lastScrollTop = useRef(0);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const dom = document.querySelector('.outer-container');

    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: dom.offsetTop - OFFSET + 1,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollActive = async () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop.current) {
        // downscroll code
        if (!hide) setHide(true);
      } else {
        // upscroll code
        if (hide) setHide(false);
      }
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', scrollActive, false);

    return () => window.removeEventListener('scroll', scrollActive, false);
  });

  return (
    <div
      className={classNames('go-top-btn', { hidden: hide })}
      onClick={(e) => handleClick(e)}
    >
      {'↑'}
    </div>
  );
}
