import djanjucks from '../../src';

describe('divisibleby filter', () => {
  it('returns true if divisible', () => {
    const result = djanjucks.renderString('{{ value|divisibleby:"2" }}', {
      value: 4
    });
    expect(result).toEqual('true');
  });

  it('returns false if not divisible', () => {
    const result = djanjucks.renderString('{{ value|divisibleby:"3" }}', {
      value: 4
    });
    expect(result).toEqual('false');
  });
});
