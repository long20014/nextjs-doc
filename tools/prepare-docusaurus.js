const {
  resolve: {
    createDocFiles,
    resolveSidebar,
    resolveNavbarFromCategories,
    createPostNavData,
  },
} = require('./utils');
function prepareDocusaurus() {
  createDocFiles();
  resolveNavbarFromCategories();
  resolveSidebar();
  createPostNavData();
}

prepareDocusaurus();
