import React, { useEffect, useState } from 'react';
import navbarDataEn from 'built-data/navbar-en.json';
import navbarDataJa from 'built-data/navbar-ja.json';
import navbarDataKo from 'built-data/navbar-ko.json';
import headerData from 'fetched-data/navbar-data.json';
import ActiveLink from './active-link';
import constants from 'src/utils/constants';
import NormalLink from './normal-link';
import LanguageSelector from './language-selector';
import { useLangContext } from 'src/contexts/language';
import { useRouter } from 'next/router';
import { resolveLangPath } from 'src/utils/resolve';
import { toggleMobileSidebar } from 'src/lib/dom-interaction';

const { NAVBAR } = constants;
const { config: navbarConfig } = headerData;

const getNavbarItems = (locale) => {
  let navbarItems = navbarDataEn.navbarItems;
  if (locale === 'ko') {
    navbarItems = navbarDataKo.navbarItems;
  }
  if (locale === 'ja') {
    navbarItems = navbarDataJa.navbarItems;
  }
  return navbarItems;
};

const linkStyles = {
  display: 'flex',
  alignItems: 'center',
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
  const router = useRouter();
  const { state } = useLangContext();
  const [navbarItems, setNavbarItems] = useState(getNavbarItems(state.lang));

  useEffect(() => {
    const lang = resolveLangPath(router.asPath);
    document.documentElement.lang = lang;
  }, [router.asPath]);

  useEffect(() => {
    setNavbarItems(getNavbarItems(state.lang));
  }, [state.lang]);

  return (
    <div id="header">
      <div className="burger-button" onClick={toggleMobileSidebar}>
        <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="2"
            d="M4 7h22M4 15h22M4 23h22"
          ></path>
        </svg>
      </div>
      <div className="logo-section">
        <NormalLink href={`/?lang=${state.lang}`} style={linkStyles}>
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
              customStyle={{ marginRight: '1rem' }}
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
