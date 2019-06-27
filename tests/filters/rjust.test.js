import djanjucks, { runtime } from '../../src';

describe('rjust filter', () => {
  it('preserves autoescape', () => {
    const result = djanjucks.renderString(
      '.{{ a|rjust:"5" }}. .{{ b|rjust:"5" }}.',
      {
        a: 'a&b',
        b: runtime.markSafe('a&b')
      }
    );
    expect(result).toEqual('.  a&amp;b. .  a&b.');
  });

  it('preserves autoescape with global off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}.{{ a|rjust:"5" }}. .{{ b|rjust:"5" }}.{% endautoescape %}',
      {
        a: 'a&b',
        b: runtime.markSafe('a&b')
      }
    );
    expect(result).toEqual('.  a&b. .  a&b.');
  });

  it('pads when arg is greater than value length', () => {
    const result = djanjucks.renderString('{{ value|rjust:"10" }}', {
      value: 'test'
    });
    expect(result).toEqual('      test');
  });

  it('does not pad when arg is less than value', () => {
    const result = djanjucks.renderString('{{ value|rjust:"3" }}', {
      value: 'test'
    });
    expect(result).toEqual('test');
  });

  it('does not pad when arg is not a number', () => {
    const result = djanjucks.renderString('{{ value|rjust:"x" }}', {
      value: 'test'
    });
    expect(result).toEqual('test');
  });

  it('supports non string value', () => {
    const result = djanjucks.renderString('{{ value|rjust:"4" }}', {
      value: 123
    });
    expect(result).toEqual(' 123');
  });
});
