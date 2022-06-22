const fs = require('fs');
const data = {
  categoryItems: null,
  dropdownItems: null,
  pageItems: null,
  pageItemsKo: null,
  pageItemsJa: null,
  tagItemsEn: null,
};

const { getLocalePath, getLocaleFileName } = require('./format');

const { EN_LOCALE_DIR, JA_LOCALE_DIR, KO_LOCALE_DIR } = require('../constants');
const { FETCHED_DATA_DIR, BUILT_DATA_DIR } = require('../constants');

const { sortItems, sortByStringField } = require('./sort');

(function () {
  if (fs.existsSync(`${FETCHED_DATA_DIR}/category-data.json`)) {
    const { items } = require('../../fetched-data/category-data.json');
    data.categoryItems = items;
  }
  if (fs.existsSync(`${FETCHED_DATA_DIR}/dropdown-data.json`)) {
    const { items } = require('../../fetched-data/dropdown-data.json');
    data.dropdownItems = items;
  }
  if (fs.existsSync(`${FETCHED_DATA_DIR}/page-data.json`)) {
    const { items } = require('../../fetched-data/page-data.json');
    data.pageItems = items;
  }
  if (fs.existsSync(`${FETCHED_DATA_DIR}/page-data-ja.json`)) {
    const { items } = require('../../fetched-data/page-data-ja.json');
    data.pageItemsJa = items;
  }
  if (fs.existsSync(`${FETCHED_DATA_DIR}/page-data-ko.json`)) {
    const { items } = require('../../fetched-data/page-data-ko.json');
    data.pageItemsKo = items;
  }
  if (fs.existsSync(`${FETCHED_DATA_DIR}/tag-data-en.json`)) {
    const { items } = require('../../fetched-data/tag-data-en.json');
    data.tagItemsEn = items;
  }
})();

const {
  categoryItems,
  dropdownItems,
  pageItems,
  pageItemsJa,
  pageItemsKo,
  tagItemsEn,
} = data;

const {
  categoryItems: defaultCategoryItems,
} = require('../../default-data/category-data.json');
const {
  toKebabCase,
  translateContentToMarkdown,
  translateContentToHtml,
  getPathParts,
  getCategoryPathPart,
  getLastPathPart,
} = require('./format');

function resolveTags() {
  function createExcerpt(content) {
    pageContent = translateContentToHtml(content);
    const pattern = /<p>.*<\/p>/g;
    const result = pattern.exec(pageContent);
    if (result) {
      const strippedHtml = result[0].replace(/<[^>]+>/g, '');
      return strippedHtml;
    }
    return '';
  }

  function resolveLocaleTags(tagItems, locale) {
    function getLPCLocale(locale) {
      switch (locale) {
        case 'en':
          return 'en_US';
        case 'ko':
          return 'ko_KR';
        case 'ja':
          return 'ja_JP';
        default:
          throw new Error('locale is invalid');
      }
    }

    const tagGroups = {};
    const tags = [];
    tagItems.forEach((tag) => {
      const { page, name } = tag;
      const localePath = getLocalePath(locale);
      pages = page
        .filter((p) => p.locale === getLPCLocale(locale))
        .map((p) => {
          const { title, path, content, name } = p;
          const excerpt = createExcerpt(content[0]);
          return {
            title: title,
            excerpt,
            to: `${localePath}/${path}/${name}`,
          };
        });
      if (pages.length > 0) {
        const result = {
          name,
          id: `${name}`,
          locale,
          to: `/tags/${name}`,
          pages,
        };
        tags.push(result);
      }
    });
    fs.writeFileSync(
      `${BUILT_DATA_DIR}/tags-${locale}.json`,
      JSON.stringify({ tags })
    );

    tags.forEach((tag) => {
      const groupName = tag.name[0];
      if (!tagGroups[groupName]) {
        tagGroups[groupName] = {
          groupName,
          items: [],
        };
      }
      tagGroups[groupName].items.push({
        to: tag.to,
        name: tag.name,
        id: `${tag.name}`,
        locale,
        pageCount: tag.pages.length,
      });
    });

    const finalTagGroups = [];
    for (const key in tagGroups) {
      finalTagGroups.push({
        ...tagGroups[key],
      });
    }
    fs.writeFileSync(
      `${BUILT_DATA_DIR}/tag-groups-${locale}.json`,
      JSON.stringify({
        tagGroups: finalTagGroups.sort((a, b) =>
          sortByStringField(a, b, 'groupName')
        ),
      })
    );
  }
  resolveLocaleTags(tagItemsEn, 'en');
  resolveLocaleTags(tagItemsEn, 'ko');
  resolveLocaleTags(tagItemsEn, 'ja');
}

function resolveSidebar() {
  function createDropdowns(item, locale) {
    const pageTitles = item.pages
      ? item.pages.map((page) => createPage(page, locale))
      : [];
    const childDropdowns =
      item.dropdowns &&
      item.dropdowns.map((dropdown) => createDropdowns(dropdown, locale));
    const items = childDropdowns
      ? pageTitles.concat(childDropdowns)
      : pageTitles;
    const localePath = getLocalePath(locale);
    const dropdown = {
      label: item.title,
      items: items,
      path: `${localePath}/${item.path}`,
      name: item.name,
    };
    return dropdown;
  }

  function createPage(page, locale) {
    const localePath = getLocalePath(locale);
    return {
      to: `${localePath}/${page.path}/${page.name}`,
      label: page.title,
      path: `${localePath}/${page.path}`,
    };
  }

  function addItemToSideBar(sidebarItems, item, locale) {
    const { title, pages, dropdowns, name } = item;
    const categoryTitle = title;
    const pageTitles = pages.map((page) => createPage(page, locale));
    const childDropdowns = dropdowns.map((dropdown) =>
      createDropdowns(dropdown, locale)
    );
    const localePath = getLocalePath(locale);

    sidebarItems[`${categoryTitle}Sidebar`] = [
      {
        type: 'category',
        label: categoryTitle,
        path: localePath,
        name: name,
        to: `${localePath}/${name}`,
        items: pageTitles.concat(childDropdowns),
        isExpanded: true,
      },
    ];
  }

  const { categoryItems } = require('../../built-data/data-tree.json');
  const {
    categoryItems: koCategoryItems,
  } = require('../../built-data/data-tree-ko.json');
  const {
    categoryItems: jaCategoryItems,
  } = require('../../built-data/data-tree-ja.json');

  function buildSidebarTree(categoryItems, locale) {
    let sidebarItems = {};

    const categoryList =
      !categoryItems || categoryItems.length === 0
        ? defaultCategoryItems
        : categoryItems;

    categoryList.forEach((item) => {
      addItemToSideBar(sidebarItems, item, locale);
    });
    const fileName = getLocaleFileName('sidebar-tree', locale);

    fs.writeFileSync(
      `${BUILT_DATA_DIR}/${fileName}.json`,
      JSON.stringify({ sidebarItems })
    );
  }
  buildSidebarTree(categoryItems, 'en');
  buildSidebarTree(koCategoryItems, 'ko');
  buildSidebarTree(jaCategoryItems, 'ja');
}

function resolveNavbarFromCategories() {
  const { categoryItems } = require('../../built-data/data-tree.json');
  const {
    categoryItems: koCategoryItems,
  } = require('../../built-data/data-tree-ko.json');
  const {
    categoryItems: jaCategoryItems,
  } = require('../../built-data/data-tree-ja.json');

  function createNavbarDataForLocale(categoryItems, locale) {
    const navbarItems = [];

    function addItemToNavBar(item, locale) {
      const { title, pages, name } = item;
      const initialPage = pages?.[0]?.name || '';
      const localePath = getLocalePath(locale);
      navbarItems.push({
        to: `${localePath}/${name}/${initialPage}`,
        label: title,
        path: `${localePath}/${name}`,
      });
    }

    const categoryList =
      !categoryItems || categoryItems.length === 0
        ? defaultCategoryItems
        : categoryItems;

    categoryList.forEach((item) => {
      addItemToNavBar(item, locale);
    });

    const fileName = getLocaleFileName('navbar', locale);

    fs.writeFileSync(
      `${BUILT_DATA_DIR}/${fileName}.json`,
      JSON.stringify({ navbarItems })
    );
  }
  createNavbarDataForLocale(categoryItems, 'en');
  createNavbarDataForLocale(koCategoryItems, 'ko');
  createNavbarDataForLocale(jaCategoryItems, 'ja');
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function createPostNavData() {
  const { sidebarItems } = require('../../built-data/sidebar-tree-en.json');
  const {
    sidebarItems: koSidebarItems,
  } = require('../../built-data/sidebar-tree-ko.json');
  const {
    sidebarItems: jaSidebarItems,
  } = require('../../built-data/sidebar-tree-ja.json');

  function createPostNavDataLocale(sidebarItems, locale) {
    const postNavItems = [];
    function createPostNavItem(item, i) {
      if (!item.items) {
        const postNavItem = {
          current: { label: item.label, link: item.to },
          previous: null,
          next: null,
        };
        postNavItems[i]['items'].push(postNavItem);
      } else {
        item.items.forEach((item) => createPostNavItem(item, i));
      }
    }

    function addPrevAndNextLinkToPostNavItems(items) {
      items.forEach((item, index) => {
        if (index > 0) {
          item.previous = items[index - 1].current;
        }
        if (index < items.length - 1) {
          item.next = items[index + 1].current;
        }
      });
    }
    let i = 0;
    for (const key in sidebarItems) {
      postNavItems.push({ to: sidebarItems[key][0].to, items: [] });
      sidebarItems[key][0].items.forEach((item) => {
        createPostNavItem(item, i);
      });
      addPrevAndNextLinkToPostNavItems(postNavItems[i].items);
      i++;
    }

    const fileName = getLocaleFileName('post-nav-data', locale);

    fs.writeFileSync(
      `${BUILT_DATA_DIR}/${fileName}.json`,
      JSON.stringify({ postNavItems })
    );
  }

  createPostNavDataLocale(sidebarItems, 'en');
  createPostNavDataLocale(koSidebarItems, 'ko');
  createPostNavDataLocale(jaSidebarItems, 'ja');
}

function createDataTrees() {
  const sortedCategoryItems = categoryItems.sort(sortItems);
  const sortedDropdownItems = dropdownItems.sort(sortItems);
  const sortedPageItemsEn = pageItems.sort(sortItems);
  const sortedPageItemsKo = pageItemsKo.sort(sortItems);
  const sortedPageItemsJa = pageItemsJa.sort(sortItems);

  function createDataTree(
    sortedCategoryItems,
    sortedDropdownItems,
    sortedPageItems,
    fileName
  ) {
    const dataTree = {
      createdDate: Date.now(),
      categoryItems: [],
    };

    const addCategoryToDataTree = (category) => {
      const categoryItem = {
        title: category.title,
        name: category.name,
        pages: [],
        dropdowns: [],
      };
      dataTree.categoryItems.push(categoryItem);
    };

    if (categoryItems) {
      sortedCategoryItems.forEach((category) => {
        addCategoryToDataTree(category);
      });
    }

    if (sortedDropdownItems && sortedCategoryItems && sortedPageItems) {
      sortedPageItems.forEach((page) => {
        const pathParts = getPathParts(page.path);
        if (pathParts.length === 1) {
          const categoryPathPart = getCategoryPathPart(pathParts);
          const matchedCategory = dataTree.categoryItems.find(
            (item) =>
              item.name.toLowerCase().trim() ===
              categoryPathPart.toLowerCase().trim()
          );
          if (matchedCategory) {
            matchedCategory.pages.push(page);
          } else {
            throw new Error('matched category not found');
          }
        } else if (pathParts.length > 1) {
          const lastPathPart = getLastPathPart(pathParts);
          const matchedDropdown = sortedDropdownItems.find(
            (item) =>
              item.name.toLowerCase().trim() ===
              lastPathPart.toLowerCase().trim()
          );
          if (matchedDropdown) {
            if (!matchedDropdown.pages) matchedDropdown.pages = [];
            matchedDropdown.pages.push(page);
          } else {
            throw new Error('matched dropdown not found');
          }
        }
      });

      sortedDropdownItems.forEach((dropdown) => {
        const pathParts = getPathParts(dropdown.path);
        if (pathParts.length === 1) {
          const categoryPathPart = getCategoryPathPart(pathParts);
          const matchedCategory = dataTree.categoryItems.find(
            (item) =>
              item.name.toLowerCase().trim() ===
              categoryPathPart.toLowerCase().trim()
          );
          if (matchedCategory) {
            matchedCategory.dropdowns.push(dropdown);
          } else {
            throw new Error('matched category not found');
          }
        } else if (pathParts.length > 1) {
          const lastPathPart = getLastPathPart(pathParts);
          const matchedDropdown = sortedDropdownItems.find(
            (item) =>
              item.name.toLowerCase().trim() ===
              lastPathPart.toLowerCase().trim()
          );
          if (matchedDropdown) {
            if (!matchedDropdown.dropdowns) matchedDropdown.dropdowns = [];
            matchedDropdown.dropdowns.push(dropdown);
          } else {
            throw new Error('matched dropdown not found');
          }
        }
      });
    }

    fs.writeFileSync(
      `${BUILT_DATA_DIR}/${fileName}.json`,
      JSON.stringify(dataTree)
    );
  }

  createDataTree(
    deepCopy(sortedCategoryItems),
    deepCopy(sortedDropdownItems),
    sortedPageItemsEn,
    'data-tree'
  );
  createDataTree(
    deepCopy(sortedCategoryItems),
    deepCopy(sortedDropdownItems),
    sortedPageItemsKo,
    'data-tree-ko'
  );
  createDataTree(
    deepCopy(sortedCategoryItems),
    deepCopy(sortedDropdownItems),
    sortedPageItemsJa,
    'data-tree-ja'
  );
}

function createDocFiles() {
  function createFilesFromCategoryData(rootDir, item) {
    const { pages, dropdowns, name } = item;

    let categoryDir = `${rootDir}/${name}`;

    if (fs.existsSync(categoryDir)) {
      fs.rmSync(categoryDir, { recursive: true, force: true });
    }
    fs.mkdirSync(categoryDir, { recursive: true });

    function createDropdowns(dropdowns) {
      dropdowns.forEach((dropdown) => {
        const { path, pages, dropdowns, name } = dropdown;
        const dir = `${rootDir}/${path}/${name}`;
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
        fs.mkdirSync(dir, { recursive: true });
        if (pages) createPageFiles(pages);
        if (dropdowns) createDropdowns(dropdowns);
      });
    }

    function createPageFiles(pages) {
      function turnArrayToString(arr) {
        return arr.map((item) => item.name).join(', ');
      }

      function createMarkdownContent(title, tag, author, updatedAt, content) {
        const tagsString = turnArrayToString(tag);
        const authorsString = turnArrayToString(author);
        const ymlFrontMatter =
          `---\n` +
          `title: ${title}\n` +
          `authors: [${authorsString}]\n` +
          `tags: [${tagsString}]\n` +
          `date: ${new Date(updatedAt).toLocaleDateString()}\n` +
          `---\n`;
        return ymlFrontMatter + content;
      }

      pages.forEach((page) => {
        const { title, path, content, name, tag, author, updatedAt } = page;
        let pageContent = '';

        if (path && content && content[0]) {
          pageContent = translateContentToMarkdown(content[0]);
        }

        const markdownContent = createMarkdownContent(
          title,
          tag,
          author,
          updatedAt,
          pageContent
        );
        const dir = `${rootDir}/${path}/${name}`;
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/index.md`, markdownContent);
      });
    }

    createPageFiles(pages);
    createDropdowns(dropdowns);
  }

  console.log("I'm creating doc files");
  try {
    const { categoryItems } = require('../../built-data/data-tree.json');
    const {
      categoryItems: jaCategoryItems,
    } = require('../../built-data/data-tree-ja.json');
    const {
      categoryItems: koCategoryItems,
    } = require('../../built-data/data-tree-ko.json');

    categoryItems.forEach((item) => {
      createFilesFromCategoryData(EN_LOCALE_DIR, item);
    });

    jaCategoryItems.forEach((item) => {
      createFilesFromCategoryData(JA_LOCALE_DIR, item);
    });

    koCategoryItems.forEach((item) => {
      createFilesFromCategoryData(KO_LOCALE_DIR, item);
    });

    console.log('✅ Doc files are created successfully');
  } catch (err) {
    console.log('❌ An error occured while fetching project data', err);
  }
}

module.exports = {
  resolveSidebar,
  resolveNavbarFromCategories,
  resolveTags,
  createDocFiles,
  createDataTrees,
  createPostNavData,
};
