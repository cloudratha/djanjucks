import { SliceArray, SliceString, slice } from 'slice';
import { runtime } from '..';

const sliceFilter = (value, arg) => {
  const args = String(arg)
    .split(':')
    .map(x => (x ? parseInt(x, 10) : null));

  const obj = Array.isArray(value)
    ? new SliceArray(...value)
    : new SliceString(value);

  let output = obj[slice(...args)];

  if (Array.isArray(value)) {
    output = output.map((item, idx) => runtime.copySafeness(value[idx], item));
  } else {
    output = runtime.copySafeness(value, output.toString());
  }

  return output;
};

export default sliceFilter;
