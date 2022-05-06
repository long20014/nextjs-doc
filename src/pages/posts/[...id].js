import React, { useState, useEffect } from 'react';
import Layout from 'src/components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import utilStyles from 'src/styles/utils.module.css';
import PostNav from 'src/components/post-nav';
import PostNavDataEn from 'built-data/post-nav-data-en.json';
import PostNavDataKo from 'built-data/post-nav-data-ko.json';
import PostNavDataJa from 'built-data/post-nav-data-ja.json';
import { useRouter } from 'next/router';
import { resolveLangPath } from 'src/utils/resolve';

const getPostNavItems = (locale) => {
  let postNavItems = PostNavDataEn.postNavItems;
  if (locale === 'ko') {
    postNavItems = PostNavDataKo.postNavItems;
  }
  if (locale === 'ja') {
    postNavItems = PostNavDataJa.postNavItems;
  }
  return postNavItems;
};

export default function Post({ postData }) {
  const router = useRouter();
  const [postNavItem, setPostNavItem] = useState(null);

  useEffect(() => {
    const lang = resolveLangPath(router.asPath);
    const categoryPostNav = getPostNavItems(lang).find((item) => {
      return router.asPath.includes(item.to);
    });
    const postNavItem = categoryPostNav.items.find((item) => {
      return router.asPath === item.current.link + '/';
    });
    setPostNavItem(postNavItem);
  }, [router.asPath]);

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

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
