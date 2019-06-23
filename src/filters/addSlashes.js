import { runtime } from '..';

const addSlashes = value => {
  if (value === null || value === undefined) {
    return '';
  }

  if (value && !(value instanceof runtime.SafeString)) {
    return value;
  }

  return runtime.copySafeness(
    value,
    value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
  );
};

export default addSlashes;
