import SidebarDataEn from '../built-data/sidebar-tree-en.json';
import SidebarDataKo from '../built-data/sidebar-tree-ko.json';
import SidebarDataJa from '../built-data/sidebar-tree-ja.json';
import NodeTree from './node-tree';
import { useRouter } from 'next/router';
import { toCapitalize } from '../utils/format';
import React, { useState, useEffect } from 'react';
import { useLangContext } from '../contexts/language/index';

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
  const getSidebarName = () => {
    return `${toCapitalize(sidebarPart)} Sidebar`;
  };
  const getSidebar = () => {
    return sidebarItems[`${toCapitalize(sidebarPart)}Sidebar`][0];
  };
  const toggleHideSidebar = () => {
    setHide((hide) => !hide);
  };

  const renderExpandSidebar = (items) => {
    return (
      <div className="sidebar" id="sidebar">
        <div className="expand tree-section">
          {getSidebarName()}
          <NodeTree items={items} />
        </div>
        <button
          style={{ width: '100%', textAlign: 'center' }}
          className="button"
          onClick={toggleHideSidebar}
        >
          {'<<'}
        </button>
      </div>
    );
  };

  const renderHiddenSidebar = () => {
    return (
      <div className="hidden-sidebar" id="sidebar" onClick={toggleHideSidebar}>
        {'>>'}
      </div>
    );
  };

  const sidebar = getSidebar();
  const items = sidebar.items;
  return !hide ? renderExpandSidebar(items) : renderHiddenSidebar();
}
