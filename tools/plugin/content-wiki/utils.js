const cheerio = require('cheerio');
const fs = require('fs');

const data = {
  configData: null,
  categoryData: null,
};

(function () {
  if (fs.existsSync(`${FETCHED_DATA_DIR}/config-data.json`)) {
    data.configData = require('../../../fetched-data/config-data.json');
  }
  if (fs.existsSync(`${FETCHED_DATA_DIR}/category-data.json`)) {
    data.categoryData = require('../../../fetched-data/category-data.json');
  }
})();

const defaultConfigData = require('../../../default-data/config-data.json');
const { plugin } = data.configData || defaultConfigData;
const defaultCategoryData = require('../../../default-data/category-data.json');
const { items: categoryItems } = data.categoryData || defaultCategoryData;
const { getLocalePath } = require('../../utils/format');

/**
 * Resolve the object containing the contentWikiPlugin and wikiCategory information from fetch jsons
 * @returns contentWikiPlugin: plugin in config and wikiCategory: designated category for wiki
 */
function getWikiPluginFromConfig() {
  const contentWikiPlugin =
    plugin?.find((i) => i._type === 'plugin_content_wiki') || {};
  const wikiCategory =
    categoryItems?.find((c) => c.id === contentWikiPlugin?.category_id) || {};

  return { contentWikiPlugin, wikiCategory };
}

/**
 * replace all matches with a specific regex pattern inside a string,
 * with support for asyncFn calls to get additional data
 * @param {string} str html content string
 * @param {regex} regex pattern for string replacement
 * @param {func} asyncFn async function that runs on all matches
 * @returns replaced string
 */
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

/**
 * Create a flattened array of all the wiki pages' paths
 * @param {array} pageObj array of pageObj(s) from page-data-from-wiki.json file
 * @param {string} prefix path of parent page as a prefix
 * @returns flattened path tree
 */
function getPathsArray(pageObj, prefix = '/') {
  return pageObj.reduce(function (pathTree, { id, path, children }) {
    let pagePath = `${prefix}${path}`;
    const hasChildren = children?.length > 0;
    const wikiUrl = `https://wiki.linecorp.com/pages/viewpage.action?pageId=${id}`;

    return pathTree
      .concat([
        {
          path: hasChildren ? `${pagePath}/introduction` : pagePath,
          id,
          wikiUrl,
        },
      ])
      .concat(hasChildren ? getPathsArray(children, `${pagePath}/`) : []);
  }, []);
}

/**
 * Remove unsupported content from html content (e.g:  Wiki's TOC part, global src var, etc.)
 * In order to use Docusaurs' built-in TOC and ignore unsupported elements
 * @param {string} htmlContent extracted from Confluence API
 * @param {array} pathsArray array of all paths on the site
 * @returns formatted htmlContent
 */
function removeUnsupportedContentFromHTML(htmlContent, pathsArray) {
  htmlContent = htmlContent.replace(/\\|\$iconUrl|\$statusIcon/g, '');
  const $ = cheerio.load(htmlContent);
  $('.confluence-information-macro-information').remove();
  if (pathsArray?.length > 0) {
    // query all <a> elements
    const { wikiCategory } = getWikiPluginFromConfig();
    const wikiCategoryPath = wikiCategory.name ? `/${wikiCategory.name}` : '';
    $('a').each(function () {
      const aHref = $(this).attr('href');
      // check its href with pages from internal page tree, replace href with path
      const foundPageFromTree = pathsArray.find((p) => p.wikiUrl === aHref);
      if (foundPageFromTree) {
        const localePath = getLocalePath('en');
        $(this).attr(
          'href',
          `${localePath}/${wikiCategoryPath}${foundPageFromTree.path}`
        );
      }
    });
  }
  return $.html();
}

module.exports = {
  getWikiPluginFromConfig,
  replaceAsync,
  getPathsArray,
  removeUnsupportedContentFromHTML,
};
