import React from 'react';
import jump from 'jump.js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

export default function TableOfContent({}) {
  const [TOC, setTOC] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [order, setOrder] = useState(-1);
  const router = useRouter();

  const styles = {
    common: {},
    normal: {},
    hover: {
      color: 'hsla(34, 83%, 49%, 0.493)',
    },
  };

  useEffect(() => {
    const headers = Array.from(
      document.querySelectorAll('.page-content h2,.page-content h3')
    );
    setHeaders(headers);
    const TOC = createTOC(headers);
    setTOC(TOC);
  }, [router.asPath]);

  const handleClick = (dom, e) => {
    e.preventDefault();
    e.stopPropagation();

    jump(dom, {
      duration: 300,
      offset: -100,
      callback: undefined,
      easing: easeInOutQuad,
      a11y: false,
    });
  };

  useEffect(() => {
    if (headers.length === 0) return;

    const scrollActive = async () => {
      const windowScrollY =
        window.scrollY || document.documentElement.scrollTop;
      const windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.getElementsByTagName('body')[0].clientHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      if (windowScrollY === documentHeight - windowHeight) {
        if (order < headers.length - 1) {
          setOrder(headers.length - 1);
        }
      } else {
        headers.map((item, i) => {
          const itemOffset = item.offsetTop - 80;
          if (windowScrollY < headers[0].offsetTop - 160) {
            setOrder(0);
          } else {
            if (windowScrollY > itemOffset) {
              setOrder(i);
            }
          }
        });
      }
    };

    window.addEventListener('scroll', scrollActive, false);

    return () => window.removeEventListener('scroll', scrollActive, false);
  }, [headers]);

  const createTOC = (headers) => {
    const TOC = [];
    headers.forEach((header, index) => {
      if (header.nodeName === 'H2') {
        TOC.push({ dom: header, children: [], order: index });
      } else {
        TOC[TOC.length - 1].children.push({
          dom: header,
          children: null,
          order: index,
        });
      }
    });
    return TOC;
  };

  const renderTOCItem = (item) => {
    const { dom, children } = item;
    const { textContent } = dom;
    if (children) {
      return (
        <li key={textContent}>
          <span
            style={order === item.order ? styles.hover : styles.normal}
            onClick={(e) => handleClick(dom, e)}
          >
            {textContent}
          </span>
          <ul>{children.map((child) => renderTOCItem(child))}</ul>
        </li>
      );
    }
    return (
      <li key={textContent}>
        <span
          style={order === item.order ? styles.hover : styles.normal}
          onClick={(e) => handleClick(dom, e)}
        >
          {textContent}
        </span>
      </li>
    );
  };

  return (
    <div className="table-of-content-container">
      <div className="table-of-content">
        <ul>{TOC.map((item) => renderTOCItem(item))}</ul>
      </div>
    </div>
  );
}
