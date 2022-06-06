const fs = require('fs');
const fetch = require('node-fetch');
const { FETCHED_DATA_DIR } = require('../constants');
const { getWikiPluginFromConfig } = require('../plugin/content-wiki/utils');
const {
  fetchContentFromTitleAndSpacekey,
} = require('../plugin/content-wiki/get-wiki');

const getJSON = (uri) => fetch(uri).then((response) => response.json());

async function fetchWiki() {
  const { contentWikiPlugin } = getWikiPluginFromConfig();
  if (contentWikiPlugin) {
    try {
      const { space, page_title } = contentWikiPlugin;

      // Step 1: Fetch content
      await fetchContentFromTitleAndSpacekey(page_title, space);
    } catch (error) {
      console.log('❌ Failed to create wiki content', error);
    }
  }
}

async function fetchCollection(collectionPath, filePath) {
  console.log(`⌛️ Fetching collection: ${collectionPath}`);
  const collectionData = await getJSON(collectionPath);

  if (collectionData) {
    if (collectionData?.message) {
      console.log(
        `❌ Fetch collection ${collectionPath} failed with message: ${collectionData.message}`
      );
      return;
    }
    console.log(`✅ Fetched collection: ${collectionPath}`);
    fs.writeFileSync(filePath, JSON.stringify(collectionData));
    console.log(`✅ Collection data saved to file: ${filePath}`);
  }
}

async function fetchProjectData() {
  const { PROJECT_URL } = process.env;
  try {
    await Promise.all([
      fetchCollection(
        `${PROJECT_URL}/collections/page/items`,
        `${FETCHED_DATA_DIR}/page-data.json`
      ),
      fetchCollection(
        `${PROJECT_URL}/collections/page/items?locale=ja_JP`,
        `${FETCHED_DATA_DIR}/page-data-ja.json`
      ),
      fetchCollection(
        `${PROJECT_URL}/collections/page/items?locale=ko_KR`,
        `${FETCHED_DATA_DIR}/page-data-ko.json`
      ),
      fetchCollection(
        `${PROJECT_URL}/collections/category/items`,
        `${FETCHED_DATA_DIR}/category-data.json`
      ),
      fetchCollection(
        `${PROJECT_URL}/collections/config/item`,
        `${FETCHED_DATA_DIR}/config-data.json`
      ),
      fetchCollection(
        `${PROJECT_URL}/collections/home_page/item`,
        `${FETCHED_DATA_DIR}/home-page-data.json`
      ),
      fetchCollection(
        `${PROJECT_URL}/collections/dropdown/items`,
        `${FETCHED_DATA_DIR}/dropdown-data.json`
      ),
      fetchCollection(
        `${PROJECT_URL}/collections/footer/item`,
        `${FETCHED_DATA_DIR}/footer-data.json`
      ),
      fetchCollection(
        `${PROJECT_URL}/collections/navbar/item`,
        `${FETCHED_DATA_DIR}/navbar-data.json`
      ),
      fetchWiki(),
    ]);
    console.log('-------');
    console.log('✅ Fetched project data');
  } catch (err) {
    console.log('❌ An error occured while fetching project data', err);
  }
}

module.exports = {
  fetchProjectData,
};
