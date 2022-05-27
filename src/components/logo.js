import React from 'react';

export default function Logo({ src }) {
  if (src.startsWith('img')) {
    const localSrc = src.replace('img', '/images');
    return <img src={localSrc} height="42" style={{ marginRight: '5px' }} />;
  }
  return <img src={src} height="42" style={{ marginRight: '5px' }} />;
}
