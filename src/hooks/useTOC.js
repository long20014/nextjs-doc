'use strict';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const OFFSET = 65;

export default function useTOC() {
  const [TOC, setTOC] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [order, setOrder] = useState(-1);
  const router = useRouter();
  const [mobileTOCDisplay, setMobileTOCDisplay] = useState(false);
  const [mobileTOCBtnActive, setMobileTOCBtnActive] = useState(false);

  const isWikiPath = (path) => {
    return path.split('/')[3] === 'wiki';
  };

  const toggleTOCDisplay = () => {
    setMobileTOCDisplay((mobileTOCDisplay) => !mobileTOCDisplay);
    // The code below is used for button transition effect.
    if (mobileTOCBtnActive) {
      setTimeout(
        () =>
          setMobileTOCBtnActive((mobileTOCBtnActive) => !mobileTOCBtnActive),
        300
      );
    } else {
      setMobileTOCBtnActive((mobileTOCBtnActive) => !mobileTOCBtnActive);
    }
  };

  useEffect(() => {
    const headers = Array.from(
      document.querySelectorAll(
        '.page-content h2,.page-content h3,.page-content h4,.page-content h5, .page-content h6'
      )
    );
    setHeaders(headers);
    const TOC = isWikiPath(router.asPath)
      ? createWikiTOC(headers)
      : createTOC(headers);
    setTOC(TOC);
  }, [router.asPath, router.locale]);

  const handleClick = (dom, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: dom.offsetTop - OFFSET + 1,
        behavior: 'smooth',
      });
    }
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
          const itemOffset = item.offsetTop - OFFSET;
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

  const addChild = (children, header, index) => {
    children.push({
      dom: header,
      children: [],
      order: index,
    });
  };

  const createTOC = (headers) => {
    const TOC = [];
    headers.forEach((header, index) => {
      if (header.nodeName === 'H2') {
        TOC.push({ dom: header, children: [], order: index });
      } else if (header.nodeName === 'H3') {
        if (TOC.length > 0 && TOC[TOC.length - 1].dom.nodeName === 'H2') {
          const h2Children = TOC[TOC.length - 1].children;
          addChild(h2Children, header, index);
        } else {
          TOC.push({ dom: header, children: [], order: index });
        }
      } else if (header.nodeName === 'H4') {
        if (TOC.length > 0 && TOC[TOC.length - 1].dom.nodeName === 'H2') {
          const h2Children = TOC[TOC.length - 1].children;
          if (h2Children.length > 0) {
            const h4Children = h2Children[h2Children.length - 1].children;
            addChild(h4Children, header, index);
          }
        } else if (
          TOC.length > 0 &&
          TOC[TOC.length - 1].dom.nodeName === 'H3'
        ) {
          const h4Children = TOC[TOC.length - 1].children;
          addChild(h4Children, header, index);
        } else {
          TOC.push({ dom: header, children: [], order: index });
        }
      }
    });
    return TOC;
  };

  const createWikiTOC = (headers) => {
    const TOC = [];
    headers.forEach((header, index) => {
      if (header.nodeName === 'H2') {
        TOC.push({ dom: header, children: [], order: index });
      } else if (header.nodeName === 'H4') {
        if (TOC.length > 0 && TOC[TOC.length - 1].dom.nodeName === 'H2') {
          const h2Children = TOC[TOC.length - 1].children;
          addChild(h2Children, header, index);
        } else {
          TOC.push({ dom: header, children: [], order: index });
        }
      } else if (header.nodeName === 'H6') {
        if (TOC.length > 0 && TOC[TOC.length - 1].dom.nodeName === 'H2') {
          const h2Children = TOC[TOC.length - 1].children;
          if (h2Children.length > 0) {
            const h4Children = h2Children[h2Children.length - 1].children;
            addChild(h4Children, header, index);
          }
        } else if (
          TOC.length > 0 &&
          TOC[TOC.length - 1].dom.nodeName === 'H4'
        ) {
          const h4Children = TOC[TOC.length - 1].children;
          addChild(h4Children, header, index);
        } else {
          TOC.push({ dom: header, children: [], order: index });
        }
      }
    });
    return TOC;
  };

  return {
    handleClick,
    TOC,
    mobileTOCDisplay,
    mobileTOCBtnActive,
    toggleTOCDisplay,
    order,
  };
}
