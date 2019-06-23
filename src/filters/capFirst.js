import { runtime } from '..';
import { normalize } from '../utilities';

const capFirst = value => {
  const str = normalize(value, '').toString();

  if (!str) {
    return '';
  }

  return runtime.copySafeness(value, str[0].toUpperCase() + str.slice(1));
};

export default capFirst;
