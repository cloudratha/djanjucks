import { runtime } from '..';

const getDigit = (value, arg) => {
  // Parse the number as a float, so we can test for Int
  const int = parseFloat(value);
  const index = parseFloat(arg);

  // Fail silently if value is not an Integer,
  // or index is less than 1.
  if (
    isNaN(int) ||
    int % 1 !== 0 ||
    (isNaN(index) || index < 1 || index % 1 !== 0)
  ) {
    return value;
  }

  const output = String(value);

  // If the index is out of range return 0
  if (index > output.length) {
    return 0;
  }

  return runtime.markSafe(parseInt(output[output.length - index], 10));
};

export default getDigit;
