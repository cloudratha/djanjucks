import djanjucks, { runtime } from '../../src';

describe('ljust filter', () => {
  it('preserves autoescape', () => {
    const result = djanjucks.renderString(
      '.{{ a|ljust:"5" }}. .{{ b|ljust:"5" }}.',
      {
        a: 'a&b',
        b: runtime.markSafe('a&b')
      }
    );
    expect(result).toEqual('.a&amp;b  . .a&b  .');
  });

  it('preserves autoescape with global off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}.{{ a|ljust:"5" }}. .{{ b|ljust:"5" }}.{% endautoescape %}',
      {
        a: 'a&b',
        b: runtime.markSafe('a&b')
      }
    );
    expect(result).toEqual('.a&b  . .a&b  .');
  });

  it('pads when arg is greater than value length', () => {
    const result = djanjucks.renderString('{{ value|ljust:"10" }}', {
      value: 'test'
    });
    expect(result).toEqual('test      ');
  });

  it('does not pad when arg is less than value', () => {
    const result = djanjucks.renderString('{{ value|ljust:"3" }}', {
      value: 'test'
    });
    expect(result).toEqual('test');
  });

  it('does not pad when arg is not a number', () => {
    const result = djanjucks.renderString('{{ value|ljust:"x" }}', {
      value: 'test'
    });
    expect(result).toEqual('test');
  });

  it('supports non string value', () => {
    const result = djanjucks.renderString('{{ value|ljust:"4" }}', {
      value: 123
    });
    expect(result).toEqual('123 ');
  });
});
