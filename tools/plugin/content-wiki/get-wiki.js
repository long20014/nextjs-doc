const fetch = require('node-fetch');
const { encode } = require('base-64');
const fs = require('fs');

const { toKebabCase } = require('../../utils/format');
const { FETCHED_DATA_DIR } = require('../../constants');
const { WIKI_U, WIKI_P, WIKI_REST_API } = require('./constants');

/**
 * Fetch data from wik.linecorp.com, using Confluence REST API
 * The detailed document can be found here: https://developer.atlassian.com/cloud/confluence/rest/intro/#about
 * @param {string} path Confluence REST API path
 * @returns Confluence REST API's reponses
 */
async function fetchWiki(path) {
  try {
    const response = await fetch(path, {
      headers: new fetch.Headers({
        Authorization: 'Basic ' + encode(WIKI_U + ':' + WIKI_P),
        'Content-Type': 'application/json',
      }),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get responded content body from wiki page id
 * @param {string} id wiki page id
 * @returns HTML string of page content
 */
async function getContentFromPageId(id) {
  const content = await fetchWiki(`${WIKI_REST_API}/content/${id}?expand=body.export_view,history`);
  return (
    {
      content: content?.body?.export_view?.value,
      date: content?.history?.createdDate,
      title: content?.title,
      path: toKebabCase(content?.title),
      locale: 'en_US', //TODO: add internationalization
      published: true,
      tag: [], //TODO: get tag info
      author: [], //TODO: get author info
    } || {}
  );
}

/**
 * Resolve children(subpage) of a page
 * @param {number} id wiki page id
 * @returns page children object, contains child's id and title
 */
async function getSubpagesFromPageId(id) {
  const content = await fetchWiki(`${WIKI_REST_API}/content/${id}?expand=children.page`);
  const results = content?.children?.page?.results || [];
  if (results?.length > 0) {
    return results.map(({ id, title }) => ({ id, title }));
  }
  return results;
}

/**
 * get page id from page's title and its space key
 * @param {string} title page title, can be found on the address bar when visit page
 * @param {string} spaceKey the key of space that page belongs to
 * @returns page id string
 */
async function getPageIdFromTitleAndSpacekey(title, spaceKey) {
  const searchResult = await fetchWiki(`${WIKI_REST_API}/content?title=${title}&spaceKey=${spaceKey}`);
  return searchResult?.results?.[0]?.id || null;
}

/**
 * Recursively resolve page content using APIs
 * @param {number} id page's id
 * @returns page object, with the page content and content of all its children
 */
async function recursiveGetPageContent(id) {
  let page = { id, children: [] };
  const pageContent = await getContentFromPageId(id);
  page = { ...page, ...pageContent };
  page.children = await getSubpagesFromPageId(id);

  if (page?.children?.length > 0) {
    const childrenPromises = page.children?.map(({ id }) => recursiveGetPageContent(id));

    const childrenValues = await Promise.all(childrenPromises);
    page.children = [...childrenValues];
  }

  return page;
}

/**
 * Fetch content of a wiki page from its title and spaceKey
 * @param {string} title wiki page title
 * @param {string} spaceKey key of the space wiki page belongs to
 * @returns page object
 */
async function fetchContentFromTitleAndSpacekey(title, spaceKey) {
  console.log(`⌛️ Fetching content from Wiki with space: ${spaceKey} and title: ${title}`);
  const pageId = await getPageIdFromTitleAndSpacekey(title, spaceKey);
  const pageObj = await recursiveGetPageContent(pageId, title);
  console.log(`✅ Fetched content from Wiki`);

  fs.writeFileSync(`${FETCHED_DATA_DIR}/page-data-from-wiki.json`, JSON.stringify(pageObj));
  console.log(`✅ Fetched content saved to file /page-data-from-wiki.json`);

  return pageObj;
}

module.exports = {
  fetchContentFromTitleAndSpacekey,
};
