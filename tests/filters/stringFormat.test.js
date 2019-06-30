import djanjucks, { runtime } from '../../src';

describe('stringformat filter', () => {
  it('renders value and preserves autoescape', () => {
    const result = djanjucks.renderString(
      '.{{ a|stringformat:"5s" }}. .{{ b|stringformat:"5s" }}.',
      {
        a: 'a<b',
        b: runtime.markSafe('a<b')
      }
    );
    expect(result).toEqual('.  a&lt;b. .  a<b.');
  });

  it('renders value and preserves global autoescape', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}.{{ a|stringformat:"5s" }}. .{{ b|stringformat:"5s" }}.{% endautoescape %}',
      {
        a: 'a<b',
        b: runtime.markSafe('a<b')
      }
    );
    expect(result).toEqual('.  a<b. .  a<b.');
  });

  it('renders number with padding', () => {
    const result = djanjucks.renderString('{{ value|stringformat:"03d" }}', {
      value: 1
    });
    expect(result).toEqual('001');
  });

  it('renders array as string', () => {
    const result = djanjucks.renderString('{{ value|stringformat:"s" }}', {
      value: [1, null, 'test']
    });
    expect(result).toEqual('1,,test');
  });

  it('renders object as string', () => {
    const result = djanjucks.renderString(
      '{{ a|stringformat:"s" }}-{{ b|stringformat:"s" }}',
      {
        a: { 1: 'a&b' },
        b: { 2: runtime.markSafe('a&b') }
      }
    );
    expect(result).toEqual('[object Object]-[object Object]');
  });
});
