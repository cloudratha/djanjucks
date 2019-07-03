import { runtime } from '..';
import { conditionalEscape } from '../utilities';

const traverse = (value, autoescape, tabs = 1) => {
  let output = '';
  let prev = null;
  const tab = '\t'.repeat(tabs);
  value.forEach(item => {
    if (prev !== null && !Array.isArray(item)) {
      if (Array.isArray(prev)) {
        output += `\n${tab}</li>\n`;
      } else {
        output += `</li>\n`;
      }
    }
    if (Array.isArray(item)) {
      output += `\n${tab}<ul>\n${traverse(
        item,
        autoescape,
        tabs + 1
      )}\n${tab}</ul>`;
    } else {
      output += `${tab}<li>${autoescape ? conditionalEscape(item) : item}`;
    }
    prev = item;
  });
  if (prev !== null && !Array.isArray(prev)) {
    output += `</li>`;
  } else {
    output += `\n${tab}</li>`;
  }
  return output;
};

function unorderedList(value) {
  const { autoescape } = this.env.opts;
  return runtime.markSafe(traverse(value, autoescape));
}

export default unorderedList;
