import utilStyles from '../styles/utils.module.css';
import { useMemo } from 'react';
import Link from 'next/link';
import SidebarData from '../built-data/sidebar-tree.json';
import NodeTree from './node-tree';
import { useRouter } from 'next/router';
import { toCapitalize } from '../utils/format';
import styles from './sidebar.module.css';

export default function Sidebar() {
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
  const sidebar = getSidebar();
  const items = sidebar.items;
  return (
    <div className={styles.sidebar} id="sidebar">
      <div className="expand">
        {getSidebarName()}
        <NodeTree items={items} />
      </div>
    </div>
  );
}
