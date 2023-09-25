// ----------------------------------------------------------------------

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function ascending(a, b, orderBy) {
  const aValue = a[orderBy];
  const bValue = b[orderBy];

  // Convert values to strings for consistent comparison
  const aValueStr = String(aValue).toLowerCase().trim();
  const bValueStr = String(bValue).toLowerCase().trim();

  if (aValueStr <= bValueStr) {
    return -1;
  }
  if (aValueStr >= bValueStr) {
    return 1;
  }
  return 0; // Elements are equal
}

function descending(a, b, orderBy) {
  const aValue = a[orderBy];
  const bValue = b[orderBy];

  // Convert values to strings for consistent comparison
  const aValueStr = String(aValue).toLowerCase().trim();
  const bValueStr = String(bValue).toLowerCase().trim();

  if (aValueStr >= bValueStr) {
    return -1;
  }
  if (aValueStr <= bValueStr) {
    return 1;
  }
  return 0; // Elements are equal
}

export function getComparator(order, orderBy) {
  if (order === 'desc') {
    return (a, b) => descending(a, b, orderBy);
  } 
  return (a, b) => ascending(a, b, orderBy);
}
