import get from 'lodash.get';

const dictsort = (value, key) => {
  value.sort((a, b) => {
    const aValue = get(a, key);
    const bValue = get(b, key);
    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }

    return 0;
  });

  return value;
};

export default dictsort;
