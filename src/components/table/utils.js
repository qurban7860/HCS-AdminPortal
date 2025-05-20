import { isNaN } from "lodash";

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function isNumeric(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

function isValidDate(value) {
  return !isNaN(Date.parse(value));
}

function getValue(obj, orderBy) {
  if (orderBy.includes('[]')) {
    const orderByArray = orderBy.split('.');
    const prop = orderByArray[0];
    const secondProp = orderByArray[1];
    return obj[prop] && obj[prop][0] && obj[prop][0][secondProp];
  }
  if (orderBy.includes('.') && orderBy.split('.').length === 2) {
    const orderByArray = orderBy.split('.');
    return orderByArray.reduce((acc, prop) => acc && acc[prop], obj);
  }
  if (orderBy.includes('.') && orderBy.split('.').length === 3) {
    const orderByArray = orderBy.split('.');
    const prop = orderByArray[0];
    const secondProp = orderByArray[1];
    const thirdProp = orderByArray[2];
    return obj[prop] && obj[prop][secondProp] && obj[prop][secondProp][thirdProp];
  }
  return obj[orderBy];
}

function ascending(a, b, orderBy) {
  const aValue = getValue(a, orderBy);
  const bValue = getValue(b, orderBy);
  
  if (isValidDate(aValue) && isValidDate(bValue)) {
    return new Date(aValue) - new Date(bValue);
  }

  if (isNumeric(aValue) && isNumeric(bValue)) {
    return parseFloat(aValue) - parseFloat(bValue);
  }

  const aStr = aValue ? String(aValue).toLowerCase().trim() : '';
  const bStr = bValue ? String(bValue).toLowerCase().trim() : '';

  if (aStr < bStr) {
    return -1;
  }
  if (aStr > bStr) {
    return 1;
  }
  return 0;
}

function descending(a, b, orderBy) {
  const aValue = getValue(a, orderBy);
  const bValue = getValue(b, orderBy);
  
  if (isValidDate(aValue) && isValidDate(bValue)) {
    return new Date(bValue) - new Date(aValue);
  }
  
  if (isNumeric(aValue) && isNumeric(bValue)) {
    return parseFloat(bValue) - parseFloat(aValue);
  }

  const aStr = aValue ? String(aValue).toLowerCase().trim() : '';
  const bStr = bValue ? String(bValue).toLowerCase().trim() : '';

  if (aStr > bStr) {
    return -1;
  }
  if (aStr < bStr) {
    return 1;
  }
  return 0; // Elements are equal
}

export function getComparator(order, orderBy) {

  console.log(order, orderBy);
  if (order === 'desc') {
    return (a, b) => descending(a, b, orderBy);
  }
  return (a, b) => ascending(a, b, orderBy);
}
