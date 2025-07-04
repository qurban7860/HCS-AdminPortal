
export function convertValue(value, baseUnit, unitSystem, forDisplay = false) {
  // Early return for percentage - same for both systems
  if (baseUnit === '%') {
    return { convertedValue: value, formattedValue: value, measurementUnit: '%' };
  }

  // Conversion configurations
  const conversions = {
    Imperial: {
      mm: { factor: 1/25.4, unit: 'in', hasArchitectural: true },
      m: { factor: 1/25.4, unit: 'in', hasArchitectural: true },
      kg: { factor: 2.20462, unit: 'lbs' },
      msec: { factor: 1/1000, unit: 's' }
    },
    Metric: {
      m: { factor: forDisplay ? 1/1000 : 1, unit: 'm' },
      msec: { factor: 1/1000, unit: 's' }
    }
  };

  const conversion = conversions[unitSystem]?.[baseUnit];
  
  if (!conversion) {
    // No conversion needed, return original values
    return {
      convertedValue: value,
      formattedValue: value.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }),
      measurementUnit: baseUnit
    };
  }

  const convertedValue = (value * conversion.factor).toFixed(3);
  const result = {
    convertedValue,
    measurementUnit: conversion.unit
  };

  // Handle display formatting
  if (forDisplay) {
    if (conversion.hasArchitectural) {
      result.formattedValue = formatArchitecturalInches(convertedValue);
    } else {
      result.formattedValue = convertedValue.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      });
    }
  } else {
    result.formattedValue = convertedValue.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  }

  return result;
}

/**
* Converts a decimal inches value to architectural feet/inches string.
* Example: 53.375 → "4' 5 3/8\""
*/
function formatArchitecturalInches(decimalInches) {
  const totalInches = decimalInches;
  const feetOnly = Math.floor(totalInches / 12);

  const remainingInches = totalInches - feetOnly * 12;
  const wholeInches = Math.floor(remainingInches);
  const fraction = remainingInches - wholeInches;

  const fractionStr = decimalToArchitecturalFraction(fraction);

  let feetStr = '';
  if (feetOnly > 0) {
    feetStr = `${feetOnly.toLocaleString()}'`;
  }

  let inchesStr = '';
  if (wholeInches > 0 || fractionStr) {
    inchesStr = `${wholeInches || ''}${fractionStr}"`;
  }
  let result = '0"';
  if (feetStr && inchesStr) {
    result = `${feetStr} ${inchesStr}`;
  } else if (feetStr) {
    result = feetStr;
  } else if (inchesStr) {
    result = inchesStr;
  }
  return result
}


function decimalToArchitecturalFraction(decimal) {
  if (decimal < 1e-6) return '';

  const denominators = [64, 32, 16, 8, 4, 2];

  const { numerator, denominator } = denominators.reduce(
    (best, denom) => {
      const num = Math.round(decimal * denom);
      const diff = Math.abs(decimal - num / denom);

      if (diff < best.minDiff && num > 0) {
        return {
          numerator: num,
          denominator: denom,
          minDiff: diff
        };
      }
      return best;
    },
    { numerator: 0, denominator: 1, minDiff: Infinity }
  );

  // Simplify the fraction
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const simplifiedNumerator = numerator / gcd(numerator, denominator);
  const simplifiedDenominator = denominator / gcd(numerator, denominator);

  return simplifiedNumerator > 0 ? ` ${simplifiedNumerator}/${simplifiedDenominator}` : '';
}
