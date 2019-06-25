import djanjucks, { runtime } from '../../src';

describe('linenumbers filter', () => {
  it('preserves autoescape', () => {
    const result = djanjucks.renderString(
      '{{ a|linenumbers }} {{ b|linenumbers }}',
      {
        a: 'one\n<two>\nthree',
        b: runtime.markSafe('one\n&lt;two&gt;\nthree')
      }
    );
    expect(result).toEqual(
      `1. one\n2. &lt;two&gt;\n3. three 1. one\n2. &lt;two&gt;\n3. three`
    );
  });

  it('preserves autoescape with global off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|linenumbers }} {{ b|linenumbers }}{% endautoescape %}',
      {
        a: 'one\n<two>\nthree',
        b: runtime.markSafe('one\n&lt;two&gt;\nthree')
      }
    );
    expect(result).toEqual(
      `1. one\n2. <two>\n3. three 1. one\n2. &lt;two&gt;\n3. three`
    );
  });

  it('renders lines with pad', () => {
    const result = djanjucks.renderString('{{ value|linenumbers }}', {
      value: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'].join('\n')
    });
    expect(result).toEqual(
      `01. x\n02. x\n03. x\n04. x\n05. x\n06. x\n07. x\n08. x\n09. x\n10. x`
    );
  });

  it('supports non strings', () => {
    const result = djanjucks.renderString('{{ value|linenumbers }}', {
      value: 123
    });
    expect(result).toEqual(`1. 123`);
  });
});
