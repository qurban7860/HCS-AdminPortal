
export const getPeriodValueAndUnit = (period) => {
  let value = null;
  let unit = null;

  switch (period) {
    case '1 month':
      value = 1;
      unit = 'month';
      break;
    case '3 month':
      value = 3;
      unit = 'month';
      break;
    case '6 month':
      value = 6;
      unit = 'month';
      break;
    case '1 year':
      value = 1;
      unit = 'year';
      break;
    case '2 year':
      value = 2;
      unit = 'year';
      break;
    case '5 year':
      value = 5;
      unit = 'year';
      break;
    default:
      value = null;
      unit = null;
  }

  return { value, unit };
};