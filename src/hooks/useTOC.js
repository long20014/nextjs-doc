import jump from 'jump.js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { easeInOutQuad } from 'src/utils/utils';

export default function useTOC() {
  const [TOC, setTOC] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [order, setOrder] = useState(-1);
  const router = useRouter();
  const [mobileTOCDisplay, setMobileTOCDisplay] = useState(false);
  const [mobileTOCBtnActive, setMobileTOCBtnActive] = useState(false);

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
      document.querySelectorAll('.page-content h2,.page-content h3')
    );
    setHeaders(headers);
    const TOC = createTOC(headers);
    setTOC(TOC);
  }, [router.asPath, router.locale]);

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

  return {
    handleClick,
    TOC,
    mobileTOCDisplay,
    mobileTOCBtnActive,
    toggleTOCDisplay,
    order,
  };
}
