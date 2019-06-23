import djanjucks, { runtime } from '../../src';

describe('escape filter', () => {
  it('escapes the value', () => {
    const result = djanjucks.renderString('{{ a|escape }} {{ b|escape }}', {
      a: 'x&y',
      b: runtime.markSafe('x&y')
    });
    expect(result).toEqual('x&amp;y x&y');
  });

  it('escapes the value when wrapped in autoescape "off"', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|escape }} {{ b|escape }}{% endautoescape %}',
      {
        a: 'x&y',
        b: runtime.markSafe('x&y')
      }
    );
    expect(result).toEqual('x&amp;y x&y');
  });

  it('prevents double escaping', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|escape|escape }}{% endautoescape %}',
      {
        a: 'x&y'
      }
    );
    expect(result).toEqual('x&amp;y');
  });
});
