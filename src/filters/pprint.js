import { runtime } from '..';

// JSON.stringify ignores objects with methods.
// So recursively inspect to get useful data.
const parse = item => {
  if (typeof item === 'function') {
    return `[Function: ${item.name}]`;
  } else if (typeof item === 'object') {
    return Object.keys(item).reduce((accum, key) => {
      accum[key] = parse(item[key]);
      return accum;
    }, {});
  }

  return item;
};

const pprint = value => {
  return runtime.markSafe(JSON.stringify(parse(value), null, 2));
};

export default pprint;
