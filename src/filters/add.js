const add = (base, arg) => {
  if (Array.isArray(base)) {
    return [base, ...arg];
  }

  const parseArg = parseFloat(arg);

  if (!isNaN(parseArg)) {
    return base + parseArg;
  }

  return base + arg;
};

export default add;
