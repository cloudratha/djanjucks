import { runtime } from '..';

const rjust = (value, width) => {
  return runtime.copySafeness(value, String(value).padStart(width, ' '));
};

export default rjust;
