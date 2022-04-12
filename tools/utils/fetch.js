const fs = require("fs");
const fetch = require("node-fetch");
const { FETCHED_DATA_DIR } = require("../constants");

const getJSON = (uri) => fetch(uri).then((response) => response.json());

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
    await fetchCollection(
      `${PROJECT_URL}/collections/page/items`,
      `${FETCHED_DATA_DIR}/page-data.json`
    );
    await fetchCollection(
      `${PROJECT_URL}/collections/page/items?locale=ja_JP`,
      `${FETCHED_DATA_DIR}/page-data-ja.json`
    );
    await fetchCollection(
      `${PROJECT_URL}/collections/page/items?locale=ko_KR`,
      `${FETCHED_DATA_DIR}/page-data-ko.json`
    );
    await fetchCollection(
      `${PROJECT_URL}/collections/category/items`,
      `${FETCHED_DATA_DIR}/category-data.json`
    );
    await fetchCollection(
      `${PROJECT_URL}/collections/config/item`,
      `${FETCHED_DATA_DIR}/config-data.json`
    );
    await fetchCollection(
      `${PROJECT_URL}/collections/home_page/item`,
      `${FETCHED_DATA_DIR}/home-page-data.json`
    );
    await fetchCollection(
      `${PROJECT_URL}/collections/dropdown/items`,
      `${FETCHED_DATA_DIR}/dropdown-data.json`
    );
    await fetchCollection(
      `${PROJECT_URL}/collections/footer/item`,
      `${FETCHED_DATA_DIR}/footer-data.json`
    );
    await fetchCollection(
      `${PROJECT_URL}/collections/navbar/item`,
      `${FETCHED_DATA_DIR}/navbar-data.json`
    );
    console.log("-------");
    console.log("✅ Fetched project data");
  } catch (err) {
    console.log("❌ An error occured while fetching project data", err);
  }
}

module.exports = {
  fetchProjectData,
};
