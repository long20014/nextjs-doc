const fs = require('fs');

const { convertHTMLContentToMarkdown } = require('../../utils/format');
const { createImageFile } = require('../create-image-file');
const {
  WIKI_ROOT_DIRECTORY,
  WIKI_IMAGE_DIRECTORY,
  INTRODUCTION_PAGE_NAME,
} = require('./constants');
const { EN_LOCALE_DIR } = require('../../constants');
const { removeUnsupportedContentFromHTML, replaceAsync } = require('./utils');

/**
 * Create docs .md files for page and all of its children
 * @param {pageObj} page provided page object
 * @param {string} path path of page
 * @param {array} pathsArray array of all paths on the site
 */
async function recursivelyCreateFiles(page, path, pathsArray = []) {
  const { content, children, title, date } = page || {};
  if (!content) {
    return;
  }

  const hasChildren = children?.length > 0 || false;
  let filePath = `${EN_LOCALE_DIR}/${WIKI_ROOT_DIRECTORY}/${path}`;
  if (hasChildren) {
    // if (!fs.existsSync(filePath)) {
    //   fs.mkdirSync(filePath, { recursive: true });
    //   // fs.writeFileSync(
    //   //   `${filePath}/_category_.json`,
    //   //   JSON.stringify({
    //   //     label: title,
    //   //     position: 1,
    //   //   })
    //   // );
    // }
    filePath += `/${INTRODUCTION_PAGE_NAME}`;
  }

  // Enter procedure for formatting HTML Content before converting to .md files
  // Step 1: Remove TOC element, in order to use Docusaurs' built-in TOC
  const modifiedContent = removeUnsupportedContentFromHTML(content, pathsArray);

  // Step 2: fetch all images, save to static asset folder and replace links with path to static file
  const formattedHtmlContent = await replaceAsync(
    modifiedContent,
    /(http[^\s]+(jpg|jpeg|png|tiff)+(\?|&)([^=]+)...\b)/g,
    async (imgSrc) => {
      const imagePath = await createImageFile(imgSrc, WIKI_IMAGE_DIRECTORY);
      return imagePath;
    }
  );

  // Step 3: Add Docusaurus YML Frontmatter
  const ymlFrontMatter =
    `---\n` +
    `title: ${title}\n` +
    `date: ${new Date(date).toLocaleDateString()}\n` +
    `---\n`;

  // Step 4: Convert to Markdown content
  const markdownContent =
    ymlFrontMatter + convertHTMLContentToMarkdown(formattedHtmlContent);

  // Step 5: Write md files
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true, force: true });
  }
  fs.mkdirSync(filePath, { recursive: true });
  fs.writeFileSync(`${filePath}/index.md`, markdownContent);

  children?.forEach((child) => {
    recursivelyCreateFiles(child, `${path}/${child.path}`, pathsArray);
  });
}

module.exports = {
  recursivelyCreateFiles,
};
