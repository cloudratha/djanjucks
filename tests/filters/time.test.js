import djanjucks from '../../src';

const testDate = new Date('01-01-2019 01:00:00');
const noonDate = new Date('01-01-2019 12:00:00');
const midnightDate = new Date('01-01-2019 00:00:00');

const timeTests = {
  a: 'a.m.',
  A: 'AM',
  e: '',
  f: '1',
  g: '1',
  G: '1',
  h: '01',
  H: '01',
  i: '00',
  O: '',
  P: '1 a.m.',
  s: '00',
  T: '',
  u: '000',
  Z: ''
};

describe('time filter', () => {
  Object.keys(timeTests).forEach(test => {
    it(`converts ${test}`, () => {
      const result = djanjucks.renderString(`{{ value|time:'${test}' }}`, {
        value: testDate
      });

      expect(result).toEqual(timeTests[test]);
    });
  });

  it('returns noon or midnight with P', () => {
    const noon = djanjucks.renderString(`{{ value|time:'P' }}`, {
      value: noonDate
    });

    const midnight = djanjucks.renderString(`{{ value|time:'P' }}`, {
      value: midnightDate
    });

    expect(noon).toEqual('noon');
    expect(midnight).toEqual('midnight');
  });

  it('returns the minutes if not 00 with f', () => {
    const result = djanjucks.renderString(`{{ value|time:'f' }}`, {
      value: new Date('01-01-2019 01:30:00')
    });

    expect(result).toEqual('1:30');
  });
});
