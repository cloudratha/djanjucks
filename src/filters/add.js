const add = (base, arg) => {
  if (Array.isArray(base)) {
    return [base, ...arg];
  }

  return base + arg;
};

export default add;
