import { runtime } from '..';

const ljust = (value, width) => {
  return runtime.copySafeness(value, String(value).padEnd(width, ' '));
};

export default ljust;
