const { NodeHtmlMarkdown } = require('node-html-markdown');

const nhm = new NodeHtmlMarkdown({ keepDataImages: true });

const nhmWithHeadingCustomization = new NodeHtmlMarkdown(
  { keepDataImages: true },
  {
    // Docusaurus TOC by default ignores h1 -> change h1->h2, h2->h3,...
    'h1,h2,h3,h4,h5,h6': ({ node }) => ({
      prefix: '##'.repeat(+node.tagName.charAt(1)) + ' ',
    }),
  }
);

function toKebabCase(str) {
  return (
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join('-')
  );
}

const getPathParts = (path) => {
  if (path) return path.split('/');
  return [];
};

const getCategoryPathPart = (pathParts) => {
  if (pathParts.length > 0) return pathParts[0];
  return null;
};

const getLastPathPart = (pathParts) => {
  if (pathParts.length > 0) return pathParts.slice(-1)[0];
  return null;
};

const formatPath = (path) => {
  const pathParts = getPathParts(path);
  const formatedPath = pathParts.map((part) => toKebabCase(part)).join('/');
  return formatedPath;
};

function translateContentToMarkdown(contentComponent) {
  const contentString = contentComponent.editor || '';
  switch (contentComponent._type) {
    case 'rich_text_editor':
      return nhm.translate(contentString);
    case 'markdown_editor':
      return contentString;
    default:
      return '';
  }
}

function toNonWhitespaced(str) {
  return str.replace(/\s/g, '');
}

function convertHTMLContentToMarkdown(htmlContent) {
  return nhmWithHeadingCustomization.translate(htmlContent);
}

function getLocalePath(locale) {
  return locale ? `/posts/${locale}` : '/posts';
}

function getLocaleFileName(fileName, locale) {
  return locale ? `${fileName}-${locale}` : fileName;
}

module.exports = {
  toKebabCase,
  translateContentToMarkdown,
  getPathParts,
  getCategoryPathPart,
  getLastPathPart,
  toNonWhitespaced,
  convertHTMLContentToMarkdown,
  getLocalePath,
  getLocaleFileName,
};
