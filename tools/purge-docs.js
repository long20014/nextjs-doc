const fs = require('fs');
const { POSTS_ROOT_DIR } = require('./constants');

if (fs.existsSync(POSTS_ROOT_DIR)) {
  fs.rmSync(POSTS_ROOT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(POSTS_ROOT_DIR, { recursive: true });
