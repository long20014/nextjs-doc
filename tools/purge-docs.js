const fs = require('fs');
const { PAGES_ROOT_DIR } = require('./constants');

if (fs.existsSync(PAGES_ROOT_DIR)) {
  fs.rmSync(PAGES_ROOT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(PAGES_ROOT_DIR, { recursive: true });
