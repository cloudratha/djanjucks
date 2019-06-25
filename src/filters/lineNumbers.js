import { runtime } from '..';
import { escapeHtml } from '../utilities';

function lineNumbers(value) {
  const autoescape =
    this.env.opts.autoescape && !(value instanceof runtime.SafeString);
  const lines = String(value).split('\n');
  const width = String(String(lines.length).length);

  return runtime.markSafe(
    lines
      .map(
        (line, index) =>
          `${String(index + 1).padStart(width, '0')}. ${
            autoescape ? escapeHtml(line) : line
          }`
      )
      .join('\n')
  );
}

export default lineNumbers;
