import { format, isValid, getTime, parseISO, formatDistanceToNow, differenceInDays, parse } from 'date-fns';

// ----------------------------------------------------------------------

export const stringToDate = (dateString, formatString = 'dd/MM/yyyy') => {
  try {
    const parsedDate = parse(dateString, formatString, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    console.error('Invalid date format', error);
    return null;
  }
};


export function isValidDate(date) {
  if (isValid(new Date(date))) {
    return true;
  }
  return false;
}

export function fDate(date, newFormat) {

  const fm = newFormat || 'dd MMM yyyy';
  if (isValid(new Date(date))) {
    return date ? format(new Date(date), fm) : '';
  }
  return date
}

export function fTime(date, newFormat = 'hh:mm a') {
  if (isValid(new Date(date))) {
    return format(new Date(date), newFormat);
  }
  return date;
}

export function GetDifferenceInDays(definedDay) {
  const today = new Date();
  const definedDate = parseISO(definedDay);
  const difference = differenceInDays(definedDate, today);
  return difference;
}

export function fQuarterYearDate(startDate, newFormat) {
  if (startDate) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 2);
    const formattedStartDate = format(start, newFormat || 'MMM yyyy');
    const formattedEndDate = format(end, newFormat || 'MMM yyyy')
    return `${formattedStartDate}-${formattedEndDate}`;
  }
  return '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';
  if (isValid(new Date(date))) {
    return date ? format(new Date(date), fm) : '';
  }
  return date
}

export function fTimestamp(date) {
  if (isValid(date)) {
    return date ? getTime(new Date(date)) : '';
  }
  return date
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date))
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

export function getTimeObjectFromISOString(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedValueTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const timeObject = { value: formattedValueTime, label: `${formattedTime} ${ampm}` };
  return timeObject;
}
