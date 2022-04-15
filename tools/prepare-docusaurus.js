const {
  resolve: { createDocFiles, resolveSidebar, resolveNavbarFromCategories },
} = require('./utils');
function prepareDocusaurus() {
  createDocFiles();
  resolveNavbarFromCategories();
  resolveSidebar();
}

prepareDocusaurus();
