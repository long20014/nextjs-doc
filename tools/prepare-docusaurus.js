const {
  resolve: {
    createDocFiles,
    resolveSidebar,
    resolveTags,
    resolveNavbarFromCategories,
    createPostNavData,
  },
} = require('./utils');

const { main: runWikiPlugin } = require('./plugin/content-wiki');
function prepareDocusaurus() {
  resolveTags();
  createDocFiles();
  resolveNavbarFromCategories();
  resolveSidebar();
  runWikiPlugin();
  createPostNavData();
}

prepareDocusaurus();
