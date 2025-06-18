export function validateGraphDateRange(dateFrom, dateTo, periodType) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  switch (periodType) {
    case 'Hourly': {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      const diffHours = (to - from) / (1000 * 60 * 60);
      if (diffHours >= 24) return 'For hourly, maximum period length is 24 hours';
      break;
    }

    case 'Daily': {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      const diffDays = (to - from) / (1000 * 60 * 60 * 24);
      if (diffDays > 31) return 'For daily, maximum period length is 31 days';
      break;
    }

    case 'Monthly': {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      const diffDays = (to - from) / (1000 * 60 * 60 * 24);
      if (diffDays > 365) return 'For monthly, maximum period length is 1 year';
      break;
    }

    case 'Quarterly': {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      const diffDays = (to - from) / (1000 * 60 * 60 * 24);
      if (diffDays > 1095) return 'For quarterly, maximum period length is 3 years';
      break;
    }

    case 'Yearly': {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      const diffDays = (to - from) / (1000 * 60 * 60 * 24);
      if (diffDays > 3650) return 'For yearly, maximum period length is 10 years';
      break;
    }

    default:
      return null;
  }

  return null;
}
