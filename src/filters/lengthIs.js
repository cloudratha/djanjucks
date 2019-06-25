const lengthIs = (value, arg) => {
  if (value.length === undefined) {
    return '';
  }

  const length = parseFloat(arg);
  if (length % 1 !== 0) {
    return '';
  }

  return value.length === parseInt(arg, 10);
};

export default lengthIs;
