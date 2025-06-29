
export function convertValue(value, baseUnit, unitSystem, forDisplay = false) {
  let convertedValue = value;
  let measurementUnit = baseUnit;

  if (unitSystem === 'Imperial') {
    if (baseUnit === 'mm' || baseUnit === 'm') {
      // convert everything to inches
      convertedValue = (value / 25.4).toFixed(3);
      measurementUnit = 'in';

      if (forDisplay) {
        // architectural format: e.g. 4' 5 3/8"
        return {
          convertedValue,
          formattedValue: formatArchitecturalInches(convertedValue),
          measurementUnit
        };
      }
    }
    // else if (baseUnit === 'kg') {
    //   convertedValue = value * 2.20462;
    //   measurementUnit = 'lbs';

    //   if (forDisplay) {
    //     return {
    //       convertedValue,
    //       formattedValue: convertedValue.toLocaleString(undefined, {
    //         minimumFractionDigits: 3,
    //         maximumFractionDigits: 3
    //       }),
    //       measurementUnit
    //     };
    //   }
    // }
  } else if (unitSystem === 'Metric') {
    if (baseUnit === 'm') {
      convertedValue = value / 1000;
      measurementUnit = 'm';
    }
    // mm stays mm
    // kg stays kg
  }

  return {
    convertedValue,
    formattedValue: convertedValue.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }),
    measurementUnit
  };
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
    inchesStr = `${wholeInches}${fractionStr}"`;
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

  return numerator > 0 ? ` ${numerator}/${denominator}` : '';
}
