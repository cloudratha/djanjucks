import { runtime } from '..';

const linebreaks = value => {
  return new runtime.SafeString(
    value
      .split('\n\n')
      .map(sentence => `<p>${sentence}</p>`)
      .join('\n')
  );
};

export default linebreaks;
