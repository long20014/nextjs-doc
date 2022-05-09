export const resolveLangPath = (path) => {
  if (path.split('/')[2]) {
    return path.split('/')[2];
  }
  const lang = path.split('lang=');
  if (lang.length > 1) {
    return lang[1].substring(0, 2);
  }
  return null;
};
