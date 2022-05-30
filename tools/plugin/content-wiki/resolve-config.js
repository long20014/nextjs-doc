const { getWikiPluginFromConfig } = require('./utils');
const { sidebarItems } = require('../../../built-data/sidebar-tree-en.json');
const { navbarItems } = require('../../../built-data/navbar-en.json');
const { BUILT_DATA_DIR } = require('../../constants');
const { INTRODUCTION_PAGE_NAME } = require('./constants');
const fs = require('fs');

const getLocalePath = (locale) => {
  return locale ? `/posts/${locale}` : '/posts';
};

/**
 * Resolve wiki config object from page object
 * @param {pageObj} pageObj provided page object
 * @returns wiki config object, includes navBar and sideBar configs
 */
const resolveWikiConfig = (pageObj) => {
  const { contentWikiPlugin, wikiCategory } = getWikiPluginFromConfig();
  if (contentWikiPlugin && wikiCategory) {
    const { name, title } = wikiCategory;
    const firstPagePath =
      pageObj?.children?.length > 0
        ? `${name}/${pageObj.path}/${INTRODUCTION_PAGE_NAME}`
        : `${name}/${pageObj.path}`;

    (function addWikiNavbar() {
      const wikiNavBarItem = navbarItems.find((item) => item.label === 'Wiki');
      wikiNavBarItem.to = `/posts/en/${firstPagePath}`;
      wikiNavBarItem.label = 'Wiki';
      wikiNavBarItem.path = '/posts/en/wiki';
      fs.writeFileSync(
        `${BUILT_DATA_DIR}/navbar-en.json`,
        JSON.stringify({ navbarItems })
      );
    })();

    (function addWikiSidebar() {
      function createPageItem(page, parent) {
        const localePath = getLocalePath('en');
        const path = parent ? parent.to : `${localePath}/wiki`;
        const pageName = page.path;
        const to =
          page.children.length > 0
            ? `${path}/${pageName}/${INTRODUCTION_PAGE_NAME}`
            : `${path}/${pageName}`;
        return {
          to: to,
          label: page.title,
          path: path,
        };
      }

      function createSidebarItems() {
        const localePath = getLocalePath('en');
        const parent = {
          path: `${localePath}/${name}`,
          title: title,
          to: `${localePath}/${name}/${pageObj.path}`,
        };
        const items = pageObj.children.map((child) => {
          return createPageItem(child, parent);
        });

        const result = {
          label: pageObj.title,
          items: [createPageItem(pageObj), ...items],
          path: `${localePath}/${name}`,
          name: pageObj.path,
        };
        return result;
      }

      const wikiSidebar = sidebarItems.WikiSidebar;
      const wikiSidebarItems = [createSidebarItems()];
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
