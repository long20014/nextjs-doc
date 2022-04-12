const {
  fetch: { fetchProjectData },
} = require('./utils');

if (process.env.PROJECT_URL) {
  console.log(
    `🔧 Preparing docs files: from project '${process.env.PROJECT_URL}'`
  );
  fetchProjectData();
} else {
  throw new Error(`❌ prepare-pages: PROJECT_URL does not exist.`);
}
