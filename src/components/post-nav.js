import React from 'react';
import NormalLink from './normal-link';

export default function PostNav({ postNavItem }) {
  return (
    <div className="post-nav">
      {postNavItem?.previous && (
        <NormalLink
          style={{ marginRight: 'auto' }}
          href={postNavItem.previous.link}
        >
          <button className="post-nav-button text-align-left">
            {'« '} {postNavItem.previous.label}
          </button>
        </NormalLink>
      )}
      {postNavItem?.next && (
        <NormalLink href={postNavItem.next.link} style={{ marginLeft: 'auto' }}>
          <button className="post-nav-button text-align-right">
            {postNavItem.next.label} {' »'}
          </button>
        </NormalLink>
      )}
    </div>
  );
}
