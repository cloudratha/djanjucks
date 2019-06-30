import { sprintf } from 'sprintf-js';
import { runtime } from '..';

const stringFormat = (value, arg) => {
  const output = sprintf(`%${arg}`, value);
  return runtime.copySafeness(value, output);
};

export default stringFormat;
