export function checkValuesNotNull(obj) {
    return Object.values(obj).some(value => value !== null);
  }

  export  const inputTypes = [
    { _id:1 , name: 'Boolean'},
    { _id:2 , name: 'Date'},
    { _id:3 , name: 'Long Text'},
    { _id:4 , name: 'Number'},
    { _id:5 , name: 'Short Text'},
    { _id:6 , name: 'Status'},
  ]

  export  const  unitTypes = [
    { _id:1 , name: 'Cycle'},
    { _id:2 , name: 'Feet'},
    { _id:3 , name: 'Inches'},
    { _id:4 , name: 'Meter'},
    { _id:5 , name: 'Milimeter'},
    { _id:6 , name: 'Unit'},
  ]

  export  const    statusTypes = [
    { _id:1 , name: 'Healthy'},
    { _id:2 , name: 'Service Required'},
    { _id:3 , name: 'Under Service'},
    { _id:4 , name: 'Replacement Required'},
    { _id:5 , name: 'Replaced Recently'},
    { _id:6 , name: 'Yes'},
    { _id:6 , name: 'No'},

  ]

  export  const    recordTypes = [
    { _id:1 , name: 'SERVICE'},
    { _id:2 , name: 'REPAIR'},
    { _id:3 , name: 'TRAINING'},
    { _id:4 , name: 'PRE-INSTALL'},
    { _id:5 , name: 'INSTALL'},
  ]

  export  const    headerFooterTypes = [
    { _id:1 , name: 'Text'},
    { _id:2 , name: 'Image'},
  ]

  export  const    status = [
    { _id:1 , name: 'Draft'},
    { _id:2 , name: 'Submitted'},
    { _id:3 , name: 'Approved'},
  ]

  export const today = new Date();
  export const futureDate = new Date(today);
  futureDate.setFullYear(today.getFullYear() + 5);

  export const future20yearDate = new Date(today);
  future20yearDate.setFullYear(today.getFullYear() + 20);

  export const pastDate = new Date(2000, 0, 1);

  export const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }