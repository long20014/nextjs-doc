const fetch = require('node-fetch');
const fs = require('fs');
const { encode } = require('base-64');
const { toNonWhitespaced } = require('../utils/format');
require('dotenv').config({
  path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
});

const WIKI_U = process.env.WIKI_U || '';
const WIKI_P = process.env.WIKI_P || '';

async function createImageFile(link, rootDir) {
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }
  const filenameFromPath = new URL(link).pathname.split('/').pop();
  const filename = toNonWhitespaced(decodeURIComponent(filenameFromPath));
  const imgPath = `${rootDir}/${filename}`;
  const absoluteImgPath = imgPath.split('public')?.[1] || imgPath;
  // use in dev mode only
  if (fs.existsSync(imgPath) && process.env.MODE === 'development') {
    return absoluteImgPath;
  }

  const imgRes = await fetch(link, {
    headers: new fetch.Headers({
      Authorization: 'Basic ' + encode(WIKI_U + ':' + WIKI_P),
    }),
  });
  const buffer = await imgRes.buffer();

  fs.writeFile(imgPath, buffer, () =>
    console.log(`Saved image file to  ${imgPath}`)
  );

  return absoluteImgPath;
}

module.exports = {
  createImageFile,
};
