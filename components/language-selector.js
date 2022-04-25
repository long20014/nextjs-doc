import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function languageSelector() {
  const selectRef = useRef(null);
  const router = useRouter();
  const languageList = [
    { value: 'en', label: 'EN' },
    { value: 'ja', label: 'JA' },
    { value: 'ko', label: 'KO' },
  ];

  useEffect(() => {
    if (selectRef.current.value !== router.locale) {
      selectRef.current.value = router.locale;
    }
  }, []);

  useEffect(() => {
    changeLanguage(router.locale);
  }, [router.locale]);

  const changeLanguage = (language) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, {
      locale: language,
    });
  };

  return (
    <div>
      <select
        id="language-selector"
        onChange={(e) => changeLanguage(e.target.value)}
        value={router.locale}
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
