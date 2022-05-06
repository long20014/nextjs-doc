import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { POSTS_ROOT_DIR } from 'tools/constants';

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
}

export function getAllPostIds() {
  const postIds = [];

  function getAllFileNames(rootDir) {
    const fileNames = fs.readdirSync(rootDir);
    fileNames.forEach((fileName) => {
      const fullPath = path.join(rootDir, fileName);
      if (!fs.lstatSync(fullPath).isDirectory()) {
        const id = rootDir.split('/').slice(1);
        postIds.push(id);
      } else {
        getAllFileNames(fullPath);
      }
    });
  }

  getAllFileNames(postsDirectory);

  return postIds.map((id) => {
    return {
      params: {
        id,
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id.join('/')}/index.md`);
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
