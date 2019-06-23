import djanjucks from '../../src';

describe('widthratio tag', () => {
  it('prevents the ratio from exceeding the width', () => {
    const result = djanjucks.renderString('{% widthratio a b 0 %}', {
      a: 50,
      b: 100
    });

    expect(result).toEqual('0');
  });

  it('handles division by 0', () => {
    const result = djanjucks.renderString('{% widthratio a b 100 %}', {
      a: 0,
      b: 0
    });

    expect(result).toEqual('0');
  });

  it('returns the expected output if value is 0', () => {
    const result = djanjucks.renderString('{% widthratio a b 100 %}', {
      a: 0,
      b: 100
    });

    expect(result).toEqual('0');
  });

  it('returns the expected output if value is 50', () => {
    const result = djanjucks.renderString('{% widthratio a b 100 %}', {
      a: 50,
      b: 100
    });

    expect(result).toEqual('50');
  });

  it('returns the expected output if value is 100', () => {
    const result = djanjucks.renderString('{% widthratio a b 100 %}', {
      a: 100,
      b: 100
    });

    expect(result).toEqual('100');
  });

  it('rounds the value down if x.5', () => {
    const result = djanjucks.renderString('{% widthratio a b 100 %}', {
      a: 50,
      b: 80
    });

    expect(result).toEqual('62');
  });

  it('rounds the value down if x.4 or less', () => {
    const result = djanjucks.renderString('{% widthratio a b 100 %}', {
      a: 50,
      b: 70
    });

    expect(result).toEqual('71');
  });

  it('rounds the value up if greater than x.5', () => {
    const result = djanjucks.renderString('{% widthratio a b 100 %}', {
      a: 80,
      b: 90
    });

    expect(result).toEqual('89');
  });

  it('stores value to context with "as"', () => {
    const result = djanjucks.renderString(
      '{% widthratio a b 100 as width %}{{ width }}',
      {
        a: 50,
        b: 100
      }
    );

    expect(result).toEqual('50');
  });

  it('supports floats', () => {
    const result = djanjucks.renderString('{% widthratio a b 100.2 %}', {
      a: 32.553,
      b: 89.22
    });

    expect(result).toEqual('37');
  });

  it('supports width as lookup', () => {
    const result = djanjucks.renderString('{% widthratio a b c %}', {
      a: 30,
      b: 100,
      c: 100
    });

    expect(result).toEqual('30');
  });

  it('returns an empty string if output is isNaN', () => {
    const result = djanjucks.renderString('{% widthratio a b 100 %}', {
      b: 100
    });

    expect(result).toEqual('');
  });
});
