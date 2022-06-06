const { getWikiPluginFromConfig } = require('./utils');
const { sidebarItems } = require('../../../built-data/sidebar-tree-en.json');
const { navbarItems } = require('../../../built-data/navbar-en.json');
const { BUILT_DATA_DIR } = require('../../constants');
const { INTRODUCTION_PAGE_NAME } = require('./constants');
const fs = require('fs');
const { getLocalePath } = require('../../utils/format');

/**
 * Resolve wiki config object from page object
 * @param {pageObj} pageObj provided page object
 * @returns wiki config object, includes navBar and sideBar configs
 */
const resolveWikiConfig = (pageObj) => {
  const { contentWikiPlugin, wikiCategory } = getWikiPluginFromConfig();
  if (contentWikiPlugin && wikiCategory) {
    const localePath = getLocalePath('en');
    const { name, title } = wikiCategory;
    const firstPagePath =
      pageObj?.children?.length > 0
        ? `${name}/${pageObj.path}/${INTRODUCTION_PAGE_NAME}`
        : `${name}/${pageObj.path}`;

    (function addWikiNavbar() {
      const wikiNavBarItem = navbarItems.find((item) => item.label === 'Wiki');
      wikiNavBarItem.to = `${localePath}/${firstPagePath}`;
      wikiNavBarItem.label = 'Wiki';
      wikiNavBarItem.path = `${localePath}/wiki`;
      fs.writeFileSync(
        `${BUILT_DATA_DIR}/navbar-en.json`,
        JSON.stringify({ navbarItems })
      );
    })();

    (function addWikiSidebar() {
      function createPageItem(page, parent) {
        const path = parent.to;
        const pageName = page.path;
        const to =
          page.children.length > 0
            ? `${path}/${INTRODUCTION_PAGE_NAME}`
            : `${path}/${pageName}`;
        return {
          to: to,
          label: page.title,
          path: path,
        };
      }
      const rootParent = {
        path: `${localePath}/${name}`,
        title: title,
        to: `${localePath}/${name}/${pageObj.path}`,
      };

      function createSidebarItems(currentItem, parent) {
        const introItem = createPageItem(currentItem, parent);
        const items = currentItem.children.map((child) => {
          if (child.children.length > 0) {
            const currentParent = {
              path: parent.to,
              title: child.title,
              to: `${parent.to}/${child.path}`,
            };
            return createSidebarItems(child, currentParent);
          }
          return createPageItem(child, parent);
        });

        const result = {
          label: currentItem.title,
          items: [introItem, ...items],
          path: parent.path,
          name: currentItem.path,
        };
        return result;
      }

      const wikiSidebar = sidebarItems.WikiSidebar;
      const wikiSidebarItems = [createSidebarItems(pageObj, rootParent)];
      wikiSidebar[0].items = wikiSidebarItems;
      fs.writeFileSync(
        `${BUILT_DATA_DIR}/sidebar-tree-en.json`,
        JSON.stringify({ sidebarItems })
      );
    })();
  }
};

module.exports = {
  resolveWikiConfig,
};
