import { useState } from 'react';
import SidebarData from '../built-data/sidebar-tree.json';
import NodeTree from './node-tree';
import { useRouter } from 'next/router';
import { toCapitalize } from '../utils/format';
import React from 'react';

export default function Sidebar() {
  const [hide, setHide] = useState(false);
  const router = useRouter();
  const sidebarItems = SidebarData.sidebarItems;
  const sidebarPart = (() => {
    const pathParts = router.asPath.split('/');
    if (pathParts[2]) {
      const categorySideBar = pathParts[2];
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

  const renderExpandSidebar = () => {
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
  return !hide ? renderExpandSidebar() : renderHiddenSidebar();
}
