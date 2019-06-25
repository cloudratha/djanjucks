import { runtime } from '..';
import { escapeHtml, normalizeNewlines } from '../utilities';

function linebreaks(value) {
  const autoescape =
    this.env.opts.autoescape && !(value instanceof runtime.SafeString);
  return runtime.markSafe(
    normalizeNewlines(String(value))
      .split(/\n{2,}/g)
      .map(sentence => {
        const output = autoescape ? escapeHtml(sentence) : sentence;
        return `<p>${runtime.copySafeness(
          value,
          output.replace('\n', '<br>')
        )}</p>`;
      })
      .join('\n\n')
  );
}

export default linebreaks;
