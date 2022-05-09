import SidebarDataEn from 'built-data/sidebar-tree-en.json';
import SidebarDataKo from 'built-data/sidebar-tree-ko.json';
import SidebarDataJa from 'built-data/sidebar-tree-ja.json';
import NodeTree from './node-tree';
import { useRouter } from 'next/router';
import { toCapitalize } from 'src/utils/format';
import React, { useState, useEffect } from 'react';
import { useLangContext } from 'src/contexts/language';
import classNames from 'classnames';
import { resolveLangPath } from 'src/utils/resolve';

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

export default function Sidebar() {
  const [hide, setHide] = useState(false);
  const { state } = useLangContext();
  const [sidebarItems, setSidebarItems] = useState(getSidebarItems(state.lang));
  const router = useRouter();

  useEffect(() => {
    setSidebarItems(getSidebarItems(state.lang));
  }, [state.lang]);

  useEffect(() => {
    const lang = resolveLangPath(router.asPath);
    setSidebarItems(getSidebarItems(lang));
  }, [router.asPath]);

  const sidebarPart = (() => {
    const pathParts = router.asPath.split('/');
    const postIndex = pathParts.indexOf('posts');
    if (postIndex !== -1) {
      let categorySideBar = pathParts[postIndex + 2];
      return categorySideBar;
    } else {
      throw new Error('category not found');
    }
  })();
  const getSidebar = () => {
    return sidebarItems[`${toCapitalize(sidebarPart)}Sidebar`][0];
  };
  const toggleHideSidebar = () => {
    setHide((hide) => !hide);
  };

  const renderExpandSidebar = (hide) => {
    return (
      <div className={classNames('sidebar', { 'sidebar-hidden': hide })}>
        <div className="tree-section">
          <NodeTree items={items} />
        </div>
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

  const sidebar = getSidebar();
  const items = [sidebar];
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
}
