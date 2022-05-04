export const resolveLangPath = (path) => {
  if (path.split('/')[2]) {
    return path.split('/')[2];
  }
  const lang = path.split('=');
  if (lang !== '/') {
    return lang[1];
  }
  return null;
};
