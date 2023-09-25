// ----------------------------------------------------------------------

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function ascending(a, b, orderBy) {
  let aValue = a;
  let bValue = b;

  if(orderBy.includes('.')){

    const orderByArray = orderBy.split('.');
    aValue = orderByArray.reduce((obj, prop) => obj && obj[prop], a);
    bValue = orderByArray.reduce((obj, prop) => obj && obj[prop], b);

  }else{
    aValue = a[orderBy];
    bValue = b[orderBy];
  }
  
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

  let aValue = a;
  let bValue = b;

  if(orderBy.includes('.')){

    const orderByArray = orderBy.split('.');
    aValue = orderByArray.reduce((obj, prop) => obj && obj[prop], a);
    bValue = orderByArray.reduce((obj, prop) => obj && obj[prop], b);

  }else{
    aValue = a[orderBy];
    bValue = b[orderBy];
  }

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
