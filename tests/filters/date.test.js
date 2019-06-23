import djanjucks from '../../src';

const testDate = new Date('01-01-2019 01:00:00');
const noonDate = new Date('01-01-2019 12:00:00');
const midnightDate = new Date('01-01-2019 00:00:00');

const dateTests = {
  d: '01',
  j: '1',
  D: 'Tue',
  l: 'Tuesday',
  S: 'st',
  w: '2',
  z: '1',
  W: '1',
  m: '01',
  n: '1',
  M: 'Jan',
  b: 'jan',
  F: 'January',
  t: '31',
  y: '19',
  Y: '2019',
  L: 'false',
  o: '2019',
  g: '1',
  G: '1',
  h: '01',
  H: '01',
  i: '00',
  s: '00',
  u: '000',
  a: 'a.m.',
  A: 'AM',
  f: '1',
  P: '1 a.m.'
};

describe('date filter', () => {
  Object.keys(dateTests).forEach(test => {
    it(`converts ${test}`, () => {
      const result = djanjucks.renderString(`{{ value|date:'${test}' }}`, {
        value: testDate
      });

      expect(result).toEqual(dateTests[test]);
    });
  });

  it('returns noon or midnight with P', () => {
    const noon = djanjucks.renderString(`{{ value|date:'P' }}`, {
      value: noonDate
    });

    const midnight = djanjucks.renderString(`{{ value|date:'P' }}`, {
      value: midnightDate
    });

    expect(noon).toEqual('noon');
    expect(midnight).toEqual('midnight');
  });

  it('returns the minutes if not 00 with f', () => {
    const result = djanjucks.renderString(`{{ value|date:'f' }}`, {
      value: new Date('01-01-2019 01:30:00')
    });

    expect(result).toEqual('1:30');
  });
});
