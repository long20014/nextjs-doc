const { NodeHtmlMarkdown } = require('node-html-markdown');

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

function convertHTMLToMarkdown(contentComponent) {
  const nhm = new NodeHtmlMarkdown();
  const htmlString =
    (contentComponent._type === 'rich_text_editor' &&
      contentComponent.editor) ||
    '';
  return htmlString ? nhm.translate(htmlString) : '';
}

module.exports = {
  toKebabCase,
  convertHTMLToMarkdown,
  getPathParts,
  getCategoryPathPart,
  getLastPathPart,
};
