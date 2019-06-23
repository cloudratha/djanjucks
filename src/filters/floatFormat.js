import prettyNum, { PRECISION_SETTING } from 'pretty-num';
import fromExponential from 'from-exponential';
import { runtime } from '..';

const floatFormat = (value, arg) => {
  // If value is invalid short circuit.
  if (isNaN(parseFloat(value))) {
    return '';
  }

  const parseArg = parseInt(arg, 10);

  // Set defaults.
  let precision = 1;
  let sign = 1;

  // If arg is a valid Integer.
  if (!isNaN(parseArg)) {
    sign = Math.sign(parseArg);
    precision = Math.abs(parseArg);
  } else if (arg !== undefined) {
    // Only get here is arg is set, but not a valid Integer.
    precision = null;
  }

  // Parse string with exponential support.
  const original = fromExponential(value);
  let originalParts = original.split('.');

  // Inspect the mantissa value.
  if (originalParts[1]) {
    // See if the mantissa is is purely made of 0s.
    let remainding = originalParts[1].replace(/0+$/, '');
    if (remainding === '') {
      precision = 0;
    }
  }

  // Pretty the number to the precision at a fixed position.
  let float = prettyNum(value, {
    precision,
    precisionSetting: PRECISION_SETTING.FIXED
  });

  // Depending on the sign of the argument we need to clean up the mantissa.
  let parts = float.split('.');
  const remainding = (parts[1] && parts[1].length) || 0;

  if (remainding === 0) {
    parts[1] = '';
  }

  // If a positive arg, add trailing 0s until we reach the arg count.
  if (sign === 1 && remainding < parseArg) {
    for (let i = remainding; i < parseArg; i += 1) {
      parts[1] += '0';
    }
    float = parts.join('.');
  } else if (sign === -1 && !originalParts[1]) {
    // If a negative arg, and the mantissa is all 0s, drop it.
    float = parts[0];
  }

  return runtime.markSafe(float);
};

export default floatFormat;
