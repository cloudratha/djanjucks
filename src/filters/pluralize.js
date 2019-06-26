import { runtime } from '..';

const pluralize = (value, arg = 's') => {
  const bits = arg.split(',');
  if (bits.length === 1) {
    bits.unshift('');
  } else if (bits.length > 2) {
    return '';
  }

  const parseValue = parseFloat(value);

  let output = bits[0];
  if (!Array.isArray(value) && isNaN(parseValue)) {
    output = bits[0];
  } else if (parseValue !== 1 || (Array.isArray(value) && value.length !== 1)) {
    output = bits[1];
  }

  return runtime.markSafe(output);
};

export default pluralize;
