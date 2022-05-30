require('dotenv').config({
  path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
});
const fs = require('fs');

const { fetchContentFromTitleAndSpacekey } = require('./get-wiki');
const { recursivelyCreateFiles } = require('./create-md');
const { resolveWikiConfig } = require('./resolve-config');
const { BUILT_DATA_DIR } = require('../../constants');
const { getPathsArray, getWikiPluginFromConfig } = require('./utils');

function main() {
  const { contentWikiPlugin } = getWikiPluginFromConfig();
  if (contentWikiPlugin) {
    try {
      // const { space, page_title } = contentWikiPlugin;

      // Step 1: Fetch content
      // await fetchContentFromTitleAndSpacekey(page_title, space);

      // Step 2: Create related .md files
      const pageObj = require('../../../fetched-data/page-data-from-wiki.json');
      const pathsArray = pageObj ? getPathsArray([pageObj]) : [];
      recursivelyCreateFiles(pageObj, pageObj.path, pathsArray);

      // Step 3: Create wiki additional config for navbar and sidebar
      const wikiConfig = resolveWikiConfig(pageObj);
      // fs.writeFileSync(
      //   `${BUILT_DATA_DIR}/config-wiki.json`,
      //   JSON.stringify(wikiConfig)
      // );
    } catch (error) {
      console.log('❌ Failed to create wiki content', error);
    }
  }
}

module.exports = {
  main,
};
