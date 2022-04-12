function sortName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function sortOrder(a, b) {
  return a.orderz - b.orderz;
}

function sortItems(a, b) {
  if (a.orderz !== b.orderz) return sortOrder(a, b);
  return sortName(a, b);
}

module.exports = {
  sortItems,
};