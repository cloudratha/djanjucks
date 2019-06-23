import djanjucks from '../../src';

describe('force_escape filter', () => {
  it('escapes when autoescape global is true', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|force_escape }}{% endautoescape %}',
      {
        a: 'x&y'
      }
    );
    expect(result).toEqual('x&amp;y');
  });

  it('escapes regardless of autoescape', () => {
    const result = djanjucks.renderString('{{ a|force_escape }}', {
      a: 'x&y'
    });
    expect(result).toEqual('x&amp;y');
  });

  it('supports double escaping', () => {
    const result = djanjucks.renderString('{{ a|force_escape|force_escape }}', {
      a: 'x&y'
    });
    expect(result).toEqual('x&amp;amp;y');
  });

  it('prevents further escaping when autoescape global is true', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|force_escape|escape }}{% endautoescape %}',
      {
        a: 'x&y'
      }
    );
    expect(result).toEqual('x&amp;y');
  });

  it('prevents further escaping regardless of autoescape', () => {
    const result = djanjucks.renderString('{{ a|force_escape|escape }}', {
      a: 'x&y'
    });
    expect(result).toEqual('x&amp;y');
  });

  it('escapes a previously escaped value regardless of autoescape', () => {
    const result = djanjucks.renderString('{{ a|escape|force_escape }}', {
      a: 'x&y'
    });
    expect(result).toEqual('x&amp;amp;y');
  });

  it('escapes a previously escaped value when autoescape global is true', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|escape|force_escape }}{% endautoescape %}',
      {
        a: 'x&y'
      }
    );
    expect(result).toEqual('x&amp;amp;y');
  });
});
