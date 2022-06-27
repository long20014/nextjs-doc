function sortName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function sortByStringField(a, b, strFieldName) {
  if (a[strFieldName] < b[strFieldName]) {
    return -1;
  }
  if (a[strFieldName] > b[strFieldName]) {
    return 1;
  }
  return 0;
}

function sortOrder(a, b) {
  return a.orderz - b.orderz;
}

function sortItems(a, b) {
  if (a.orderz !== b.orderz) return sortOrder(a, b);
  return sortByStringField(a, b, 'name');
}

module.exports = {
  sortItems,
  sortByStringField,
};
