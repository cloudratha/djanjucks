import { runtime } from '..';

const safeSeq = value => {
  return value.map(item => new runtime.SafeString(String(item)));
};

export default safeSeq;
