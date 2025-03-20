const parseFraction = (fractionStr) => {
  const [numerator, denominator] = fractionStr.split('/').map(Number);
  return numerator / denominator;
};

const parseComplexInches = (value) => {
  // Handle decimal inches
  if (!Number.isNaN(parseFloat(value))) {
    return parseFloat(value);
  }

  const regex = /(\d+)'?\s*(\d+)?\s*(\d+\/\d+)?"/;
  const match = value.match(regex);
  if (!match) return null;

  const feet = parseInt(match[1], 10) || 0;
  const inches = parseInt(match[2], 10) || 0;
  const fraction = match[3] ? parseFraction(match[3]) : 0;

  return feet * 12 + inches + fraction;
};

const convertMmToM = (value) => {
  if (!value) return '';
  // Remove commas and convert to float
  const numValue = parseFloat(value.toString().replace(/,/g, ''));
  if (Number.isNaN(numValue)) return value;
  return (numValue / 1000).toFixed(3);
};


export { parseComplexInches, convertMmToM };
