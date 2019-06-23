import { runtime } from '..';
import { createHmtlTag, translateMap } from '../utilities';

const JSON_SCRIPT_ESCAPES = {
  '>': '\\u003E',
  '<': '\\u003C',
  '&': '\\u0026'
};

const jsonScript = (value, name = '') => {
  const json = JSON.stringify(value, null, 2);
  const attrs = {
    id: name,
    type: 'application/json'
  };

  return runtime.markSafe(
    createHmtlTag('script', translateMap(json, JSON_SCRIPT_ESCAPES), attrs)
  );
};

export default jsonScript;
