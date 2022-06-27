export const resolveLangPath = (path) => {
  const validLangs = ['en', 'ja', 'ko'];
  const langPath = path.split('/')[2];
  if (langPath && validLangs.includes(langPath)) {
    return langPath;
  }
  const lang = path.split('lang=');
  if (lang.length > 1) {
    return lang[1].substring(0, 2);
  }
  return 'en';
};
