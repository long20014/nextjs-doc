import React, { useEffect, useRef } from 'react';
import { useLangContext } from '../contexts/language/index';
import { changeLang } from '../contexts/language/action';
import { useRouter } from 'next/router';

export default function languageSelector() {
  const { dispatch, state } = useLangContext();
  const selectRef = useRef(null);
  const router = useRouter();
  const languageList = [
    { value: 'en', label: 'EN' },
    { value: 'ja', label: 'JA' },
    { value: 'ko', label: 'KO' },
  ];

  useEffect(() => {
    if (selectRef.current.value !== state.lang) {
      selectRef.current.value = state.lang;
    }
  }, []);

  const changeLanguage = (language) => {
    const { pathname, asPath, query } = router;
    localStorage.setItem('lang', language);
    const lang = localStorage.getItem('lang') || 'ko';
    changeLang(dispatch, lang);
    router.push({ pathname, query }, asPath, {
      locale: lang,
    });
  };

  return (
    <div>
      <select
        id="language-selector"
        onChange={(e) => changeLanguage(e.target.value)}
        value={state.lang}
        ref={selectRef}
      >
        {languageList.map((item) => {
          const { label, value } = item;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
