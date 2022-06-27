import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { resolveLangPath } from 'src/utils/resolve';
import tagGroupEn from 'built-data/tag-groups-en.json';
import tagGroupJa from 'built-data/tag-groups-ja.json';
import tagGroupKo from 'built-data/tag-groups-ko.json';
import NormalLink from '@/components/normal-link';
import Layout from '@/components/layout';

const getTagGroups = (locale) => {
  let tagGroups = tagGroupEn.tagGroups;
  if (locale === 'ko') {
    tagGroups = tagGroupKo.tagGroups;
  }
  if (locale === 'ja') {
    tagGroups = tagGroupJa.tagGroups;
  }
  return tagGroups;
};

function TagRow({ tagGroup, lang }) {
  return (
    <li className="tag-group-row">
      <h2 className="tag-group-label">{tagGroup.groupName.toUpperCase()}</h2>
      {tagGroup.items.map((item) => (
        <TagItem key={item.id} item={item} lang={lang} />
      ))}
    </li>
  );
}

function TagItem({ item, lang }) {
  const { to, name, pageCount } = item;
  return (
    <NormalLink href={`${to}/?lang=${lang}`} classes={'tag-item'}>
      <span>{name}</span>
      <span className="page-count">{pageCount}</span>
    </NormalLink>
  );
}

export default function Tag({}) {
  const router = useRouter();
  const [tagGroups, setTagGroups] = useState(null);
  const [lang, setLang] = useState(resolveLangPath(router.asPath));

  useEffect(() => {
    const currentLang = resolveLangPath(router.asPath);
    setLang(currentLang);
  }, [router.asPath]);

  useEffect(() => {
    const tagGroups = getTagGroups(lang);
    setTagGroups(tagGroups);
  }, [lang]);

  return (
    <Layout type="tags">
      <div className="tag-groups-section">
        <h1>Tags</h1>
        <ul>
          {tagGroups &&
            tagGroups.map((tagGroup) => (
              <TagRow
                key={tagGroup.groupName}
                tagGroup={tagGroup}
                lang={lang}
              />
            ))}
        </ul>
      </div>
    </Layout>
  );
}
