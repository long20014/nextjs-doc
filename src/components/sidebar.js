import NodeTree from './node-tree';
import { useRouter } from 'next/router';
import { toCapitalize } from '../utils/format';
import React, { useState, useEffect } from 'react';
import SidebarDataEn from '../../built-data/sidebar-tree.json';
import SidebarDataKo from '../../built-data/sidebar-tree-ko.json';
import SidebarDataJa from '../../built-data/sidebar-tree-ja.json';
import classNames from 'classnames';

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
  const router = useRouter();
  const [hide, setHide] = useState(false);
  const [sidebarItems, setSidebarItems] = useState(
    getSidebarItems(router.locale)
  );

  useEffect(() => {
    setSidebarItems(getSidebarItems(router.locale));
  }, [router.locale]);

  const sidebarPart = (function getSidebarPart() {
    const pathParts = router.asPath.split('/');
    const postIndex = pathParts.indexOf('posts');
    if (postIndex !== -1) {
      let categorySideBar = pathParts[postIndex + 1];
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
