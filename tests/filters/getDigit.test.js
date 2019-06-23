import djanjucks from '../../src';

const GET_DIGIT_TESTS = {
  1: '3',
  2: '2',
  3: '1',
  4: '0',
  0: '123',
  '1': '3',
  A: '123',
  '1.2': '123'
};

describe('get_digit filter', () => {
  Object.keys(GET_DIGIT_TESTS).forEach(digit => {
    it(`extract the digit "${digit}"`, () => {
      const result = djanjucks.renderString(
        `{{ value|get_digit:"${digit}" }}`,
        {
          value: 123
        }
      );
      expect(result).toEqual(GET_DIGIT_TESTS[digit]);
    });
  });
});
