import React from 'react';
import NormalLink from './normal-link';

export default function PostNav({ postNavItem }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      {postNavItem.previous && (
        <NormalLink
          style={{ marginRight: 'auto' }}
          href={postNavItem.previous.link}
        >
          <button>
            {'< '} {postNavItem.previous.label}
          </button>
        </NormalLink>
      )}
      {postNavItem.next && (
        <NormalLink href={postNavItem.next.link} style={{ marginLeft: 'auto' }}>
          <button>
            {postNavItem.next.label} {' >'}
          </button>
        </NormalLink>
      )}
    </div>
  );
}
