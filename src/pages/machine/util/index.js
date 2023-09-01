export function checkValuesNotNull(obj) {
    return Object.values(obj).some(value => value !== null);
  }