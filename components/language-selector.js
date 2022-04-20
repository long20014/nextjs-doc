import React from 'react';
import { useLangContext } from '../contexts/language/index';
import { changeLang } from '../contexts/language/action';
import { useRouter } from 'next/router';

export default function languageSelector() {
  const { dispatch, state } = useLangContext();
  const router = useRouter();
  const languageList = [
    { value: 'en', label: 'EN' },
    { value: 'ja', label: 'JA' },
    { value: 'ko', label: 'KO' },
  ];

  const changeLanguage = (language) => {
    const { pathname, asPath, query } = router;
    localStorage.setItem('lang', language);
    const lang = localStorage.getItem('lang') || 'ko';
    const pathnameParts = window.location.pathname.split('/');
    const docPath = pathnameParts.slice(2).join('/');
    changeLang(dispatch, lang);
    console.log(`doc path: ${pathname} ${asPath}`);
    if (lang === 'en') {
      let pathPart = asPath.split('/');
      if (pathPart[2] === 'ja' || pathPart[2] === 'ko') {
        pathPart = [...pathPart.slice(0, 2), ...pathPart.slice(3)];
      }
      const path = pathPart.join('/');
      router.push({ pathname, query }, path, {
        locale: lang,
      });
    } else {
      const pathPart = asPath.split('/');
      if (pathPart[2] === 'ja' || pathPart[2] === 'ko') {
        if (pathPart[2] === 'ja' && lang === 'ko') {
          pathPart[2] = 'ko';
        } else if (pathPart[2] === 'ko' && lang === 'ja') {
          pathPart[2] = 'ja';
        }
      }
      if (
        pathPart[1] === 'posts' &&
        pathPart[2] !== 'ja' &&
        pathPart[2] !== 'ko'
      ) {
        router.push(`/posts/${docPath}`, `/posts/${lang}/${docPath}`, {
          locale: lang,
        });
      } else {
        const path = pathPart.join('/');
        router.push({ pathname, query }, path, {
          locale: lang,
        });
      }
    }
  };

  return (
    <div>
      <select
        id="language-selector"
        onChange={(e) => changeLanguage(e.target.value)}
        value={state.lang}
      >
        {languageList.map((item) => {
          const { label, value } = item;
          return (
            <option
              key={value}
              value={value}
              defaultValue={value === state.lang}
            >
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
