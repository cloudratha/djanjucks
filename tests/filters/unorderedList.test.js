import djanjucks, { runtime } from '../../src';

describe('unorderedlist filter', () => {
  it('escapes the content except for the wrapping html', () => {
    const result = djanjucks.renderString('{{ value|unorderedlist }}', {
      value: ['x>', ['<y']]
    });
    expect(result).toEqual(
      '\t<li>x&gt;\n\t<ul>\n\t\t<li>&lt;y</li>\n\t</ul>\n\t</li>'
    );
  });

  it('prevents escaping the content', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|unorderedlist }}{% endautoescape %}',
      {
        value: ['x>', ['<y']]
      }
    );
    expect(result).toEqual(
      '\t<li>x>\n\t<ul>\n\t\t<li><y</li>\n\t</ul>\n\t</li>'
    );
  });

  it('escapes the content except for safe strings', () => {
    const result = djanjucks.renderString('{{ value|unorderedlist }}', {
      value: ['x>', [runtime.markSafe('<y')]]
    });
    expect(result).toEqual(
      '\t<li>x&gt;\n\t<ul>\n\t\t<li><y</li>\n\t</ul>\n\t</li>'
    );
  });

  it('prevents escaping', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|unorderedlist }}{% endautoescape %}',
      {
        value: ['x>', [runtime.markSafe('<y')]]
      }
    );
    expect(result).toEqual(
      '\t<li>x>\n\t<ul>\n\t\t<li><y</li>\n\t</ul>\n\t</li>'
    );
  });

  it('renders a single depth list', () => {
    const result = djanjucks.renderString('{{ value|unorderedlist }}', {
      value: ['item 1', 'item 2']
    });
    expect(result).toEqual('\t<li>item 1</li>\n\t<li>item 2</li>');
  });

  it('renders a 2 depth list', () => {
    const result = djanjucks.renderString('{{ value|unorderedlist }}', {
      value: ['item 1', ['item 1.1']]
    });
    expect(result).toEqual(
      '\t<li>item 1\n\t<ul>\n\t\t<li>item 1.1</li>\n\t</ul>\n\t</li>'
    );
  });

  it('renders a varying depth list', () => {
    const result = djanjucks.renderString('{{ value|unorderedlist }}', {
      value: ['item 1', ['item 1.1', 'item1.2'], 'item 2']
    });
    expect(result).toEqual(
      `\t<li>item 1\n\t<ul>\n\t\t<li>item 1.1</li>
\t\t<li>item1.2</li>\n\t</ul>\n\t</li>\n\t<li>item 2</li>`
    );
  });

  it('renders a 3 depth list', () => {
    const result = djanjucks.renderString('{{ value|unorderedlist }}', {
      value: ['item 1', ['item 1.1', ['item 1.1.1', ['item 1.1.1.1']]]]
    });
    expect(result).toEqual(
      `\t<li>item 1\n\t<ul>\n\t\t<li>item 1.1\n\t\t<ul>
\t\t\t<li>item 1.1.1\n\t\t\t<ul>\n\t\t\t\t<li>item 1.1.1.1</li>
\t\t\t</ul>\n\t\t\t</li>\n\t\t</ul>\n\t\t</li>\n\t</ul>\n\t</li>`
    );
  });
});
