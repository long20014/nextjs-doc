import React from 'react';
import navbarDataEn from '../../built-data/navbar.json';
import headerData from '../../fetched-data/navbar-data.json';
import ActiveLink from './active-link';
import constants from '../utils/constants';
import NormalLink from './normal-link';
import LanguageSelector from './language-selector';

const { NAVBAR } = constants;
const { config: navbarConfig } = headerData;

const linkStyles = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'black',
};

function Logo({ src }) {
  if (src.startsWith('img')) {
    const localSrc = src.replace('img', '/images');
    return <img src={localSrc} height="42" style={{ marginRight: '5px' }} />;
  }
  return <img src={src} height="42" style={{ marginRight: '5px' }} />;
}

function Title({ title }) {
  return <div style={{ marginRight: '2rem' }}>{title}</div>;
}

export default function Header() {
  let navbarItems = navbarDataEn.navbarItems;

  return (
    <div id="header">
      <div className="logo-section">
        <NormalLink href="/" style={linkStyles}>
          <Logo src={navbarConfig.logo.src} />
          <Title title={navbarConfig.title} />
        </NormalLink>
      </div>
      <div className="nav-section">
        {navbarItems.map((item) => {
          return (
            <ActiveLink
              key={item.to}
              href={item.to}
              path={item.path}
              type={NAVBAR}
            >
              {item.label}
            </ActiveLink>
          );
        })}
      </div>
      <div className="right-section">
        <LanguageSelector></LanguageSelector>
      </div>
    </div>
  );
}
