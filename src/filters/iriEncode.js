import { runtime } from '..';
import { translateMap } from '../utilities';

const QUOTES = '":/_#?;@&=+$,"%[]<>\\';
let QUOTE_MAP = {};

for (let i = 0; i < QUOTES.length; i += 1) {
  QUOTE_MAP[QUOTES[i].charCodeAt(0)] = `${QUOTES[i]
    .charCodeAt(0)
    .toString(16)
    .toUpperCase()}`;
}

const iriEncode = value => {
  let encoded = encodeURI(value);
  // Losesly test if value is double encoded. Not really fool proof.
  encoded = encoded.replace(/%25[A-Z0-9]{2}/g, item => item.replace('25', ''));
  return runtime.copySafeness(value, translateMap(encoded, QUOTE_MAP));
};

export default iriEncode;
