import { runtime } from '..';

const defaultIfNone = (value, arg) => {
  return runtime.copySafeness(value, value !== null ? value : arg);
};

export default defaultIfNone;
