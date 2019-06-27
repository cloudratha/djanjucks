import normalize from 'normalize-strings';
import { runtime } from '..';

const slugify = value => {
  let output = String(value);
  output = normalize(output);
  output = output
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase();
  return runtime.markSafe(output.replace(/[-\s]+/g, '-'));
};

export default slugify;
