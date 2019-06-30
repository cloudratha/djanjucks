import { runtime } from '..';
import { stringify } from '../utilities';

const pprint = value => {
  return runtime.markSafe(JSON.stringify(stringify(value), null, 2));
};

export default pprint;
