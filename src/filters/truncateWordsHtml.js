import { runtime } from '..';
import Truncator from '../truncator';

const truncateWordsHtml = (value, arg) => {
  const length = parseInt(arg, 10);
  const parsedValue = String(value);
  if (isNaN(length) || length >= parsedValue.length) {
    return value;
  }

  const output = new Truncator(parsedValue).words(length, ' ...', true);

  return runtime.copySafeness(value, output);
};

export default truncateWordsHtml;
