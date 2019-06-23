import dictsort from './dictsort';

const dictsortReversed = (value, key) => {
  const sorted = dictsort(value, key);

  return sorted.reverse();
};

export default dictsortReversed;
