import { runtime } from '..';
import Truncator from '../truncator';

const truncateWords = (value, arg) => {
  const length = parseInt(arg, 10);
  const parsedValue = String(value);
  if (length >= parsedValue.length) {
    return value;
  }

  const output = new Truncator(parsedValue).words(length, ' ...');

  return runtime.copySafeness(value, output);
};

export default truncateWords;
