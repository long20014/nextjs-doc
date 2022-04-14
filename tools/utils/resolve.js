const fs = require('fs');
const data = {
  categoryItems: null,
  dropdownItems: null,
  pageItems: null,
  pageItemsKo: null,
  pageItemsJa: null,
};

const {
  POSTS_ROOT_DIR,
  JA_LOCALE_DIR,
  KO_LOCALE_DIR,
} = require('../constants');
const { FETCHED_DATA_DIR, BUILT_DATA_DIR } = require('../constants');

const { sortItems } = require('./sort');

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
})();

const {
  categoryItems,
  dropdownItems,
  pageItems,
  pageItemsJa,
  pageItemsKo,
} = data;

const {
  categoryItems: defaultCategoryItems,
} = require('../../default-data/category-data.json');
const {
  toKebabCase,
  convertHTMLToMarkdown,
  getPathParts,
  getCategoryPathPart,
  getLastPathPart,
} = require('./format');

function resolveSidebar() {
  function createDropdowns(item) {
    const pageTitles = item.pages
      ? item.pages.map((page) => createPage(page))
      : [];
    const childDropdowns =
      item.dropdowns &&
      item.dropdowns.map((dropdown) => createDropdowns(dropdown));
    const items = childDropdowns
      ? pageTitles.concat(childDropdowns)
      : pageTitles;
    const dropdown = {
      type: 'category',
      collapsible: true,
      label: item.title,
      items: items,
    };
    return dropdown;
  }

  function createPage(page) {
    return {
      path: `/posts/${page.path}/${page.name}`,
      label: page.title,
    };
  }

  function addItemToSideBar(item) {
    const { title, pages, dropdowns } = item;
    const categoryTitle = title;
    const pageTitles = pages.map((page) => createPage(page));
    const childDropdowns = dropdowns.map((dropdown) =>
      createDropdowns(dropdown)
    );
    sidebarItems[`${categoryTitle}Sidebar`] = [
      {
        type: 'category',
        label: categoryTitle,
        items: pageTitles.concat(childDropdowns),
      },
    ];
  }

  const {
    categoryItems,
    createdDate,
  } = require('../../built-data/data-tree.json');
  if (!fs.existsSync(`${BUILT_DATA_DIR}/sidebar-tree.json`)) {
    fs.writeFileSync(
      `${BUILT_DATA_DIR}/sidebar-tree.json`,
      JSON.stringify({ dataTreeCreatedDate: 0, sidebarItems: {} })
    );
  }
  const {
    sidebarItems: oldSidebarItems,
    dataTreeCreatedDate,
  } = require('../../built-data/sidebar-tree.json');

  if (oldSidebarItems && dataTreeCreatedDate === createdDate) {
    return oldSidebarItems;
  }

  let sidebarItems = {};

  const categoryList =
    !categoryItems || categoryItems.length === 0
      ? defaultCategoryItems
      : categoryItems;

  categoryList.forEach((i) => {
    addItemToSideBar(i);
  });
  fs.writeFileSync(
    `${BUILT_DATA_DIR}/sidebar-tree.json`,
    JSON.stringify({ dataTreeCreatedDate: createdDate, sidebarItems })
  );
  return sidebarItems;
}

function resolveNavbarFromCategories() {
  const navbarItems = [];
  function addItemToNavBar(item) {
    const { title, pages, name } = item;
    const initialPage = pages?.[0]?.name || '';

    navbarItems.push({
      to: `/posts/${name}/${initialPage}`,
      label: title,
    });
  }

  const { categoryItems } = require('../../built-data/data-tree.json');

  const categoryList =
    !categoryItems || categoryItems.length === 0
      ? defaultCategoryItems
      : categoryItems;

  categoryList.forEach((i) => {
    addItemToNavBar(i);
  });

  fs.writeFileSync(
    `${BUILT_DATA_DIR}/navbar.json`,
    JSON.stringify({ navbarItems })
  );

  return navbarItems;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
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
  function createFilesFromCategoryData(rootDir, item, index) {
    const { title, pages, dropdowns, name } = item;

    let categoryDir = `${rootDir}/${name}`;

    if (fs.existsSync(categoryDir)) {
      fs.rmSync(categoryDir, { recursive: true, force: true });
    }
    fs.mkdirSync(categoryDir, { recursive: true });

    // const categoryJsonConfig = {
    //   label: title,
    //   position: index + 1,
    // };
    // fs.writeFileSync(
    //   `${categoryDir}/_category_.json`,
    //   JSON.stringify(categoryJsonConfig)
    // );

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

      pages.forEach((p) => {
        const { title, path, content, name, tag, author, updatedAt } = p;
        let pageContent = '';

        if (path && content && content[0]) {
          pageContent = convertHTMLToMarkdown(content[0]);
        }

        const markdownContent = createMarkdownContent(
          title,
          tag,
          author,
          updatedAt,
          pageContent
        );

        fs.writeFileSync(`${rootDir}/${path}/${name}.md`, markdownContent);
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

    categoryItems.forEach((i, index) => {
      createFilesFromCategoryData(POSTS_ROOT_DIR, i, index);
    });

    jaCategoryItems.forEach((i, index) => {
      createFilesFromCategoryData(JA_LOCALE_DIR, i, index);
    });

    koCategoryItems.forEach((i, index) => {
      createFilesFromCategoryData(KO_LOCALE_DIR, i, index);
    });

    console.log('✅ Doc files are created successfully');
  } catch (err) {
    console.log('❌ An error occured while fetching project data', err);
  }
}

module.exports = {
  resolveSidebar,
  resolveNavbarFromCategories,
  createDocFiles,
  createDataTrees,
};
