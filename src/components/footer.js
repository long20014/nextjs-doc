import React from 'react';
import footerData from 'fetched-data/footer-data.json';
import NormalLink from './normal-link';

const { config } = footerData;

export default function Footer() {
  const { links, copyright } = config;

  const renderLink = (link) => {
    const { title, items } = link;
    return (
      <>
        <div className="item-title">{title}</div>
        {items.map((item) => {
          return renderLinkItem(item);
        })}
      </>
    );
  };

  const renderLinkItem = (item) => {
    const { label, href } = item;
    return (
      <NormalLink href={href} classes={'link-item'}>
        {`${label}  `}
        <svg
          width="13.5"
          height="13.5"
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="iconExternalLink_I5OW"
        >
          <path
            fill="currentColor"
            d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
          ></path>
        </svg>
      </NormalLink>
    );
  };

  return (
    <div className="footer">
      <div className="footer-container">
        <div className="link-area">
          {links.map((link) => {
            return renderLink(link);
          })}
        </div>
        <div className="copyright-area">{copyright}</div>
      </div>
    </div>
  );
}
