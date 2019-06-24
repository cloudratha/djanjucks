const lengthIs = (value, arg) => {
  try {
    const length = parseFloat(arg);
    if (length % 1 !== 0) {
      return '';
    }
    return value.length === parseInt(arg, 10);
  } catch (e) {
    return '';
  }
};

export default lengthIs;
