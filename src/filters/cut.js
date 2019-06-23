const cut = (value, replace) => {
  const search = new RegExp(replace, 'g');
  return value.replace(search, '');
};

export default cut;
