import djanjucks from '../../src';

const FILE_FORMATS = {
  '': '0\xa0bytes',
  number: '0\xa0bytes',
  0: '0\xa0bytes',
  1023: '1023\xa0bytes',
  1024: '1.0\xa0KB',
  10240: '10.0\xa0KB',
  1048575: '1024.0\xa0KB',
  1048576: '1.0\xa0MB',
  52428800: '50.0\xa0MB',
  1073741823: '1024.0\xa0MB',
  1073741824: '1.0\xa0GB',
  1099511627776: '1.0\xa0TB',
  1125899906842624: '1.0\xa0PB',
  2251799813680000000: '2000.0\xa0PB',
  '-4849292038': '-4.5\xa0GB'
};

describe('filesizeformat filter', () => {
  Object.keys(FILE_FORMATS).forEach(bytes => {
    it(`formats "${bytes}"`, () => {
      const result = djanjucks.renderString('{{ value|filesizeformat }}', {
        value: bytes
      });
      expect(result).toEqual(FILE_FORMATS[bytes]);
    });
  });
});
