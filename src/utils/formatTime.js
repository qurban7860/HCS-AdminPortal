import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function convertTimeToMilliseconds(timeString) {
  const timeComponents = timeString.split(' ');

  return timeComponents.reduce((totalMilliseconds, component) => {
    if (component.includes('h')) {
      const hours = parseInt(component, 10); // Specify radix 10
      return totalMilliseconds + hours * 60 * 60 * 1000;
    } if (component.includes('m')) {
      const minutes = parseInt(component, 10); // Specify radix 10
      return totalMilliseconds + minutes * 60 * 1000;
    } if (component.includes('s')) {
      const seconds = parseInt(component, 10); // Specify radix 10
      return totalMilliseconds + seconds * 1000;
    }
    return totalMilliseconds;
  }, 0);
}
