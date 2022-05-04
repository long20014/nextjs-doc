import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import navbarDataEn from '../built-data/navbar-en.json';
import navbarDataJa from '../built-data/navbar-ja.json';
import navbarDataKo from '../built-data/navbar-ko.json';
import headerData from '../fetched-data/navbar-data.json';
import ActiveLink from './active-link';
import constants from '../utils/constants';
import NormalLink from './normal-link';
import LanguageSelector from './language-selector';
import { useLangContext } from '../contexts/language/index';
import { useRouter } from 'next/router';
import { resolveLangPath } from '../utils/resolve';

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
  const router = useRouter();
  const { state } = useLangContext();
  const [navbarItems, setNavbarItems] = useState(getNavbarItems(state.lang));

  useEffect(() => {
    const lang = resolveLangPath(router.asPath);
    console.log('header lang: ' + router.asPath);
    localStorage.setItem('lang', lang);
  }, [router.asPath]);

  useEffect(() => {
    setNavbarItems(getNavbarItems(state.lang));
  }, [state.lang]);

  return (
    <div id="header">
      <div style={{ marginRight: '90px', paddingLeft: '1em' }}>
        <NormalLink href={`/?lang=${state.lang}`} style={linkStyles}>
          <Logo src={navbarConfig.logo.src} />
          <Title title={navbarConfig.title} />
        </NormalLink>
      </div>

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
      <LanguageSelector></LanguageSelector>
    </div>
  );
}
