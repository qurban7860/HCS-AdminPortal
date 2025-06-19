
export function validateGraphDateRange(dateFrom, dateTo, periodType) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  const diffMs = to - from;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  switch (periodType) {
    case 'Hourly':
      if (diffHours >= 24) return 'For hourly, maximum period length is 24 hours';
      break;

    case 'Daily':
      if (diffDays > 31) return 'For daily, maximum period length is 31 days';
      break;

    case 'Monthly':
      if (diffDays > 365) return 'For monthly, maximum period length is 1 year';
      break;

    case 'Quarterly':
      if (diffDays > 1095) return 'For quarterly, maximum period length is 3 years';
      break;

    case 'Yearly':
      if (diffDays > 3650) return 'For yearly, maximum period length is 10 years';
      break;

    default:
      return null;
  }

  return null;
}
