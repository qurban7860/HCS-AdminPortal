
export function validateGraphDateRange(dateFrom, dateTo, periodType) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  const diffMs = to - from;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const diffHours = diffMs / (1000 * 60 * 60);

  switch (periodType) {
    case 'Hourly':
      if (from.toDateString() === to.toDateString()) return null;
      if (diffHours > 24) return 'For hourly, maximum period length is 24 hours';
      break;

    case 'Daily':
      if (diffDays > 31) return 'For daily, maximum period length is 31 days';
      break;

    case 'Monthly':
      if (diffDays > 366) return 'For monthly, maximum period length is 1 year';
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
