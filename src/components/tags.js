import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NormalLink from './normal-link';
import { useLangContext } from 'src/contexts/language';

function Tag({ tag }) {
  const { state } = useLangContext();
  return (
    <NormalLink href={`/tags/${tag}?lang=${state.lang}`} classes={'tag'}>
      {tag}
    </NormalLink>
  );
}

export default function Tags({ tags }) {
  return (
    <div className="tag-section">
      <span className="tag-label">Tags: </span>
      {tags.map((tag) => {
        return <Tag key={tag} tag={tag}></Tag>;
      })}
    </div>
  );
}

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};
