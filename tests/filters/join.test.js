import djanjucks, { runtime } from '../../src';

describe('join filter', () => {
  it('joins an array', () => {
    const result = djanjucks.renderString('{{ value|join:", " }}', {
      value: ['alpha', 'beta & me']
    });
    expect(result).toEqual('alpha, beta &amp; me');
  });

  it('preserves global autoescape', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|join:", " }}{% endautoescape %}',
      {
        value: ['alpha', 'beta & me']
      }
    );
    expect(result).toEqual('alpha, beta & me');
  });

  it('preserves an escaped arg', () => {
    const result = djanjucks.renderString('{{ value|join:" &amp; " }}', {
      value: ['alpha', 'beta & me']
    });
    expect(result).toEqual('alpha &amp; beta &amp; me');
  });

  it('preserves an escaped arg with global autoescape off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|join:" &amp; " }}{% endautoescape %}',
      {
        value: ['alpha', 'beta & me']
      }
    );
    expect(result).toEqual('alpha &amp; beta & me');
  });

  it('maintains a safe string with unsafe delimeters', () => {
    const result = djanjucks.renderString('{{ value|join:var }}', {
      value: ['alpha', 'beta & me'],
      var: ' & '
    });
    expect(result).toEqual('alpha &amp; beta &amp; me');
  });

  it('maintains a safe string with safe delimeters', () => {
    const result = djanjucks.renderString('{{ value|join:var }}', {
      value: ['alpha', 'beta & me'],
      var: runtime.markSafe(' & ')
    });
    expect(result).toEqual('alpha & beta &amp; me');
  });
});
