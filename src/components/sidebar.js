import SidebarDataEn from 'built-data/sidebar-tree-en.json';
import SidebarDataKo from 'built-data/sidebar-tree-ko.json';
import SidebarDataJa from 'built-data/sidebar-tree-ja.json';
import navbarDataEn from 'built-data/navbar-en.json';
import navbarDataJa from 'built-data/navbar-ja.json';
import navbarDataKo from 'built-data/navbar-ko.json';
import NodeTree from './node-tree';
import ActiveLink from './active-link';
import { useRouter } from 'next/router';
import { toCapitalize } from 'src/utils/format';
import React, { useState, useEffect } from 'react';
import { useLangContext } from 'src/contexts/language';
import classNames from 'classnames';
import { resolveLangPath } from 'src/utils/resolve';
import { toggleMobileSidebar } from 'src/lib/dom-interaction';
import headerData from 'fetched-data/navbar-data.json';
import NormalLink from './normal-link';
import Logo from './logo';
import Title from './title';
import constants from 'src/utils/constants';
import MobileLanguageSelector from './mobile-language-selector';

const { NAVBAR, BACKGROUND_GRAY } = constants;
const { config: navbarConfig } = headerData;

const linkStyles = {
  display: 'flex',
  alignItems: 'center',
  color: 'black',
};

const getSidebarItems = (locale) => {
  let sidebarItems = SidebarDataEn.sidebarItems;
  if (locale === 'ko') {
    sidebarItems = SidebarDataKo.sidebarItems;
  }
  if (locale === 'ja') {
    sidebarItems = SidebarDataJa.sidebarItems;
  }
  return sidebarItems;
};

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

export default function Sidebar({ layoutType }) {
  const { state } = useLangContext();
  const [hide, setHide] = useState(false);
  const [isMainMenu, setIsMainMenu] = useState(layoutType === 'home');
  const [navbarItems, setNavbarItems] = useState(getNavbarItems(state.lang));
  const [sidebarItems, setSidebarItems] = useState(getSidebarItems(state.lang));
  const router = useRouter();

  useEffect(() => {
    setSidebarItems(getSidebarItems(state.lang));
  }, [state.lang]);

  useEffect(() => {
    const lang = resolveLangPath(router.asPath);
    setSidebarItems(getSidebarItems(lang));
  }, [router.asPath]);

  useEffect(() => {
    setNavbarItems(getNavbarItems(state.lang));
  }, [state.lang]);

  const handleBackToMainMenu = () => {
    setIsMainMenu(true);
  };

  const handleGoToCategoryMenu = () => {
    setIsMainMenu(false);
  };

  const sidebarPart = (() => {
    const pathParts = router.asPath.split('/');
    const postIndex = pathParts.indexOf('posts');
    if (postIndex !== -1) {
      let categorySideBar = pathParts[postIndex + 2];
      return categorySideBar;
    }
    return null;
  })();

  const getSidebar = () => {
    if (sidebarPart) {
      return sidebarItems[`${toCapitalize(sidebarPart)}Sidebar`][0];
    }
    return null;
  };

  const toggleHideSidebar = () => {
    setHide((hide) => !hide);
    if (hide) {
      document.querySelector('.post-container').classList.remove('expanded');
    } else {
      document.querySelector('.post-container').classList.add('expanded');
    }
  };

  const renderExpandSidebar = (hide) => {
    return (
      <div className={classNames('sidebar', { 'sidebar-hidden': hide })}>
        {renderNodeTree()}
        <button
          style={{ width: '100%', textAlign: 'center' }}
          className="button"
          onClick={toggleHideSidebar}
        >
          {'«'}
        </button>
      </div>
    );
  };

  const renderHiddenSidebar = () => {
    return (
      <div className="hidden-sidebar" onClick={toggleHideSidebar}>
        {'»'}
      </div>
    );
  };

  const renderNodeTree = () => {
    return (
      <div className={classNames('tree-section', { hidden: isMainMenu })}>
        <NodeTree items={items} />
      </div>
    );
  };

  const renderBackToMainMenuButton = () => {
    return (
      <div
        className={classNames('back-to-main-menu-btn', { hidden: isMainMenu })}
        onClick={handleBackToMainMenu}
      >
        {' ← Back To Main Menu '}
      </div>
    );
  };

  const renderGoToCategoryMenuButton = () => {
    return (
      <div
        className={classNames('go-to-category-menu-btn', {
          hidden: !isMainMenu,
        })}
        onClick={handleGoToCategoryMenu}
      >
        {' Go To Category Menu →'}
      </div>
    );
  };

  const renderCategoryTree = () => {
    return (
      <div className={classNames('nav-section', { hidden: !isMainMenu })}>
        {navbarItems.map((item) => {
          return (
            <ActiveLink
              key={item.to}
              href={item.to}
              path={item.path}
              type={NAVBAR}
              customStyle={{
                marginBottom: '3px',
                padding: '0.25em 0.5em',
                borderRadius: '5px',
              }}
              activeStyle={{
                backgroundColor: BACKGROUND_GRAY,
              }}
            >
              {item.label}
            </ActiveLink>
          );
        })}
        <MobileLanguageSelector></MobileLanguageSelector>
      </div>
    );
  };

  const renderMobileExpandSidebar = (hide) => {
    return (
      <div className={classNames('sidebar')}>
        <div className="logo-section">
          <NormalLink href={`/?lang=${state.lang}`} style={linkStyles}>
            <Logo src={navbarConfig.logo.src} />
            <Title title={navbarConfig.title} />
          </NormalLink>
          <div
            className="close-sidebar-button"
            onClick={(e) => toggleMobileSidebar(e)}
          >
            <svg viewBox="0 0 15 15" width="21" height="21">
              <g stroke="var(--light-gray-text)" strokeWidth="1.2">
                <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"></path>
              </g>
            </svg>
          </div>
        </div>
        {layoutType === 'posts' && renderGoToCategoryMenuButton()}
        {layoutType === 'posts' && renderBackToMainMenuButton()}
        {layoutType === 'posts' && renderNodeTree()}
        {renderCategoryTree()}
      </div>
    );
  };

  const sidebar = getSidebar();
  const items = [sidebar];

  const renderDesktopSidebar = () => {
    return (
      <aside
        className={classNames('sidebar-container', {
          'sidebar-container-hidden': hide,
        })}
      >
        {renderExpandSidebar(hide)}
        {hide && renderHiddenSidebar()}
      </aside>
    );
  };

  const renderMobileSidebar = () => {
    return (
      <div className="backdrop hidden" onClick={(e) => toggleMobileSidebar(e)}>
        <aside className={classNames('mobile-sidebar-container')}>
          {renderMobileExpandSidebar()}
        </aside>
      </div>
    );
  };

  return (
    <>
      {layoutType === 'posts' && renderDesktopSidebar()}
      {/* {renderMobileSidebar()} */}
    </>
  );
}
