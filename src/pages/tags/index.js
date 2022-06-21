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

function TagRow({ tagGroup }) {
  return (
    <li className="tag-group-row">
      <div className="tag-group-label">{tagGroup.groupName}</div>
      {tagGroup.items.map((item) => (
        <TagItem key={item.id} item={item} />
      ))}
    </li>
  );
}

function TagItem({ item }) {
  const { to, name } = item;
  return (
    <NormalLink href={to} classes={'tag-item'}>
      {name}
    </NormalLink>
  );
}

export default function Tag({}) {
  const router = useRouter();
  const [tagGroups, setTagGroups] = useState(null);

  useEffect(() => {
    const lang = resolveLangPath(router.asPath);
    const tagGroups = getTagGroups(lang);
    setTagGroups(tagGroups);
  }, [router.asPath]);

  return (
    <Layout type="tags">
      <div>
        <ul>
          {tagGroups &&
            tagGroups.map((tagGroup) => (
              <TagRow key={tagGroup.groupName} tagGroup={tagGroup} />
            ))}
        </ul>
      </div>
    </Layout>
  );
}
