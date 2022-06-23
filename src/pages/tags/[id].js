import Layout from '@/components/layout';
import React, { useState, useEffect } from 'react';
import tagDataEn from 'built-data/tags-en.json';
import tagDataJa from 'built-data/tags-ja.json';
import tagDataKo from 'built-data/tags-ko.json';
import NormalLink from '@/components/normal-link';
import fs from 'fs';
import { useRouter } from 'next/router';
import { resolveLangPath } from 'src/utils/resolve';

const getTags = (locale) => {
  let tags = tagDataEn.tags;
  if (locale === 'ko') {
    tags = tagDataKo.tags;
  }
  if (locale === 'ja') {
    tags = tagDataJa.tags;
  }
  return tags;
};

const getTag = (id, locale) => {
  const tags = getTags(locale);
  const tag = tags.find((t) => t.id === id);
  return tag;
};

function Page({ page }) {
  const { title, excerpt, to } = page;
  return (
    <div className="tag-result">
      <h2>
        <NormalLink href={`${to}`}>{title}</NormalLink>
      </h2>
      <p dangerouslySetInnerHTML={{ __html: excerpt }} />
    </div>
  );
}

export default function Tag({ id }) {
  const router = useRouter();
  const [tag, setTag] = useState(null);
  const [lang, setLang] = useState(resolveLangPath(router.asPath));

  useEffect(() => {
    setLang(resolveLangPath(router.asPath));
  }, [router.asPath]);

  useEffect(() => {
    const tag = getTag(id, lang);
    setTag(tag);
  }, [lang]);

  return (
    <Layout type={'tags'}>
      {tag && (
        <div className="tag-groups-section">
          <h1>{`${tag.pages.length} docs tagged with "${tag.name}"`}</h1>
          <div style={{ marginBottom: '2em' }}>
            <NormalLink href={`/tags/?lang=${lang}`}>View All Tags</NormalLink>
          </div>

          {tag.pages.map((page) => {
            return <Page key={page.to} page={page} />;
          })}
        </div>
      )}
    </Layout>
  );
}

function getAllTagIds() {
  const result = [];
  function pushToResult(tag) {
    result.push({
      params: {
        id: tag.id,
      },
    });
  }
  const tagDataEn = JSON.parse(
    fs.readFileSync('built-data/tags-en.json', 'utf8')
  );
  tagDataEn.tags.forEach((tag) => pushToResult(tag));
  return result;
}

export async function getStaticPaths() {
  const paths = getAllTagIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  };
}
