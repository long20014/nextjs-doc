const {
  resolve: {
    createDocFiles,
    resolveSidebar,
    resolveNavbarFromCategories,
    createPostNavData,
  },
} = require('./utils');

const { main: runWikiPlugin } = require('./plugin/content-wiki');
function prepareDocusaurus() {
  createDocFiles();
  resolveNavbarFromCategories();
  resolveSidebar();
  runWikiPlugin();
  createPostNavData();
}

prepareDocusaurus();
