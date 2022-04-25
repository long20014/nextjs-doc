import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { POSTS_ROOT_DIR, DEFAULT_LOCALE } from '../tools/constants';

const postsDirectory = POSTS_ROOT_DIR;

export function getSortedPostsData() {
  const allPostsData = [];

  function createPostData(rootDir) {
    const fileNames = fs.readdirSync(rootDir);
    fileNames.forEach((fileName) => {
      const id = `${rootDir}/${fileName.replace(/\.md$/, '')}`.substr(6);
      const fullPath = path.join(rootDir, fileName);
      if (!fs.lstatSync(fullPath).isDirectory()) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        allPostsData.push({
          id,
          ...matterResult.data,
        });
      } else {
        createPostData(fullPath);
      }
    });
  }

  createPostData(postsDirectory);

  return allPostsData;

  // return allPostsData.sort(({ date: a }, { date: b }) => {
  //   if (a < b) {
  //     return 1;
  //   } else if (a > b) {
  //     return -1;
  //   } else {
  //     return 0;
  //   }
  // });
}

export function getAllPostIds() {
  const fileItems = [];

  function createFileItems(rootDir) {
    if (fs.lstatSync(rootDir).isDirectory()) {
      const fileNames = fs.readdirSync(rootDir);

      fileNames.forEach((fileName) => {
        const fullPath = path.join(rootDir, fileName);

        function addToFileItems() {
          if (!fs.lstatSync(fullPath).isDirectory()) {
            const localePart = fileName.split('.')[1];
            const locale = localePart === 'md' ? DEFAULT_LOCALE : localePart;
            const id = rootDir.split('/').slice(1);
            fileItems.push({ id, locale });
          } else {
            createFileItems(fullPath);
          }
        }
        addToFileItems();
      });
    }
  }

  createFileItems(postsDirectory);

  return fileItems.map((item) => {
    const { id, locale } = item;
    return {
      params: {
        id,
      },
      locale,
    };
  });
}

export async function getPostData(id, locale) {
  const filePath =
    locale === DEFAULT_LOCALE
      ? `${id.join('/')}/index.md`
      : `${id.join('/')}/index.${locale}.md`;
  const fullPath = path.join(postsDirectory, filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
