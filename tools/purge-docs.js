const fs = require("fs");
const { DOCS_ROOT_DIR } = require("./constants");

if (fs.existsSync(DOCS_ROOT_DIR)) {
  fs.rmSync(DOCS_ROOT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DOCS_ROOT_DIR, { recursive: true });
