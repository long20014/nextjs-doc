import React from 'react';
import Layout from 'src/components/layout';
import { getAllPostIds, getPostData } from 'src/lib/posts';
import Head from 'next/head';
import utilStyles from 'src/styles/utils.module.css';
import PostNav from 'src/components/post-nav';
import PostNavData from 'built-data/post-nav-data.json';
import PostNavDataKo from 'built-data/post-nav-data-ko.json';
import PostNavDataJa from 'built-data/post-nav-data-ja.json';

const getPostNavItems = (locale) => {
  let postNavItems = PostNavData.postNavItems;
  if (locale === 'ko') {
    postNavItems = PostNavDataKo.postNavItems;
  }
  if (locale === 'ja') {
    postNavItems = PostNavDataJa.postNavItems;
  }
  return postNavItems;
};

export default function Post({ postData, postNavItem }) {
  return (
    <Layout>
      <div className="page-content">
        <Head>
          <title>{postData.title}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
        <PostNav postNavItem={postNavItem}></PostNav>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params, locale }) {
  const postData = await getPostData(params.id, locale);
  const path = `/posts/${params.id.join('/')}`;
  const postNavItems = getPostNavItems(locale);
  const sideBarData = postNavItems.find((item) => {
    return path.includes(item.to);
  });
  const postNavItem = sideBarData.items.find((item) => {
    return path === item.current.link;
  });
  return {
    props: {
      postData,
      postNavItem,
    },
  };
}