import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useHover from '../hooks/useHover';
import { useLangContext } from 'src/contexts/language/';
import { changeLang } from 'src/contexts/language/action';
import { resolveLangPath } from 'src/utils/resolve';

export default function useLanguage() {
  const router = useRouter();
  const { dispatch, state } = useLangContext();
  const [hoverRef, isHovered] = useHover();
  const [hoverRef2, isHovered2] = useHover();

  const languageList = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
  ];

  const getLanguageLabel = (lang) => {
    const langItem = languageList.find((item) => item.value === lang);
    return langItem.label;
  };

  useEffect(() => {
    const lang = resolveLangPath(router.asPath);
    changeLanguage(lang);
  }, [router.asPath]);

  const changeLanguage = (language) => {
    const { pathname, asPath, query } = router;
    const lang = language;
    const pathnameParts = window.location.pathname.split('/');
    const docPath = pathnameParts.slice(3).join('/');
    changeLang(dispatch, lang);
    console.log(`doc path: ${pathname} ${asPath}`);
    if (pathname !== '/posts/[...id]') {
      router.push({ pathname, query }, { pathname, query: `lang=${lang}` });
    } else {
      router.push(`/posts/${lang}/${docPath}`);
    }
  };

  return {
    getLanguageLabel,
    changeLanguage,
    languageList,
    state,
    hoverRef,
    hoverRef2,
    isHovered,
    isHovered2,
  };
}
