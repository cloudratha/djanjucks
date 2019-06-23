import { runtime } from '..';
import { translateMap } from '../utilities';

const JS_ESCAPE = {
  '\\': '\\u005C',
  "'": '\\u0027',
  '"': '\\u0022',
  '>': '\\u003E',
  '<': '\\u003C',
  '&': '\\u0026',
  '=': '\\u003D',
  '-': '\\u002D',
  '`': '\\u0060',
  '\n': '\\u000A',
  '\r': '\\u000D',
  '\t': '\\u0009',
  '\v': '\\u000B',
  '\f': '\\u000C',
  '\b': '\\u0008'
};

// Escape paragraph and line separator
JS_ESCAPE[String.fromCharCode(parseInt(`2028`, 16))] = `\\u2028`;
JS_ESCAPE[String.fromCharCode(parseInt(`2029`, 16))] = `\\u2029`;

// Escape every ASCII character with a value less than 32.
for (let i = 0; i < 32; i += 1) {
  JS_ESCAPE[String.fromCharCode(parseInt(`${i}04X`, 16))] = `\\u${i}04X`;
}

const escapeJs = value => {
  return runtime.markSafe(translateMap(value, JS_ESCAPE));
};

export default escapeJs;
