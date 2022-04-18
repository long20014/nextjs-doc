import React from 'react';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import PostNav from '../../components/post-nav';
import PostNavData from '../../built-data/post-nav-data.json';
const { postNavItems } = PostNavData;

export default function Post({ postData, postNavItem }) {
  return (
    <Layout>
      <div>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          {/* <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div> */}
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </div>
      <PostNav postNavItem={postNavItem}></PostNav>
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

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  const path = `/posts/${params.id.join('/')}`;
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
