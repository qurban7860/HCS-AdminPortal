// ----------------------------------------------------------------------

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function ascending(a, b, orderBy) {
  let aValue = a;
  let bValue = b;
  let aValueStr
  let bValueStr

  if(orderBy.includes('[]') ) {
    const orderByArray = orderBy.split('.');
    const prop = orderByArray[0];
    const secondProp = orderByArray[1];
    aValue = (a[prop] && a[prop][0] && a[prop][0][secondProp]) 
    bValue = (b[prop] && b[prop][0] && b[prop][0][secondProp]) 
    aValueStr = aValue;
    bValueStr = bValue;
  }else if(!orderBy.includes('[]') && orderBy.includes('.') && orderBy.split('.').length === 2) {
    const orderByArray = orderBy.split('.');
    aValue = orderByArray.reduce((obj, prop) => obj && obj[prop], a);
    bValue = orderByArray.reduce((obj, prop) => obj && obj[prop], b);
    aValueStr = String(aValue).toLowerCase().trim();
    bValueStr = String(bValue).toLowerCase().trim();
  }else if(!orderBy.includes('[]') && orderBy.includes('.') && orderBy.split('.').length === 3) {
    const orderByArray = orderBy.split('.')
    const prop = orderByArray[0];      
    const secondProp = orderByArray[1];
    const thirdProp = orderByArray[2]; 
    aValue = (a[prop] && a[prop][secondProp] && a[prop][secondProp][thirdProp]) || undefined;
    bValue = (b[prop] && b[prop][secondProp] && b[prop][secondProp][thirdProp]) || undefined;
    aValueStr = String(aValue).toLowerCase().trim();
    bValueStr = String(bValue).toLowerCase().trim();
}else{
    aValue = a[orderBy];
    bValue = b[orderBy];
    // if (!Number.isNaN(aValue) && !Number.isNaN(bValue) ) {
    //   aValueStr = Number(aValue);
    //   bValueStr = Number(bValue);
    // } else {
      aValueStr = String(aValue).toLowerCase().trim();
      bValueStr = String(bValue).toLowerCase().trim();
    // }
  }
  
  if (aValueStr <= bValueStr) {
    return -1;
  }
  if (aValueStr >= bValueStr) {
    return 1;
  }
  return 0;
}

function descending(a, b, orderBy) {

  let aValue = a;
  let bValue = b;
  let aValueStr
  let bValueStr

  if(orderBy.includes('[]') ) {
    const orderByArray = orderBy.split('.');
    const prop = orderByArray[0];
    const secondProp = orderByArray[1];
    aValue = (a[prop] && a[prop][0] && a[prop][0][secondProp]) 
    bValue = (b[prop] && b[prop][0] && b[prop][0][secondProp]) 
    aValueStr = aValue;
    bValueStr = bValue;
  }else if(!orderBy.includes('[]') && orderBy.includes('.') && orderBy.split('.').length === 2) {
    const orderByArray = orderBy.split('.');
    aValue = orderByArray.reduce((obj, prop) => obj && obj[prop], a);
    bValue = orderByArray.reduce((obj, prop) => obj && obj[prop], b);
    aValueStr = String(aValue).toLowerCase().trim();
    bValueStr = String(bValue).toLowerCase().trim();
  }else if(!orderBy.includes('[]') && orderBy.includes('.') && orderBy.split('.').length === 3) {
    const orderByArray = orderBy.split('.')
    const prop = orderByArray[0];      
    const secondProp = orderByArray[1];
    const thirdProp = orderByArray[2]; 
    aValue = (a[prop] && a[prop][secondProp] && a[prop][secondProp][thirdProp]) || undefined;
    bValue = (b[prop] && b[prop][secondProp] && b[prop][secondProp][thirdProp]) || undefined;
    aValueStr = String(aValue).toLowerCase().trim();
    bValueStr = String(bValue).toLowerCase().trim();
    }else{
    aValue = a[orderBy];
    bValue = b[orderBy];
    aValueStr = String(aValue).toLowerCase().trim();
    bValueStr = String(bValue).toLowerCase().trim();
    }

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
