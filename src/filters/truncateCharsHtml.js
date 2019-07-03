import { runtime } from '..';
import Truncator from '../truncator';

const truncateCharsHtml = (value, arg) => {
  const length = parseInt(arg, 10);
  const parsedValue = String(value);
  if (length - 3 < 0) {
    return '...';
  }

  if (length >= parsedValue.length - 3) {
    return value;
  }

  const output = new Truncator(parsedValue).chars(length, true);

  return runtime.copySafeness(value, output);
};

export default truncateCharsHtml;
