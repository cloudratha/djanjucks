import slice from 'slice.js';
import { runtime } from '..';

const sliceFilter = (value, arg) => {
  const args = String(arg)
    .split(':')
    .map(x => (x ? parseInt(x, 10) : null));

  // Add default for slice
  if (args.length === 1) {
    args.unshift('0');
  }

  const parseValue = Array.isArray(value) ? value : String(value);
  const obj = slice(parseValue);
  let output = obj[args.join(':')];

  if (Array.isArray(output)) {
    output = output.map((item, idx) => runtime.copySafeness(value[idx], item));
  } else {
    output = runtime.copySafeness(value, output.toString());
  }

  return output;
};

export default sliceFilter;
