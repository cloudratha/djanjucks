import djanjucks, { runtime } from '../../src';

describe('wordwrap filter', () => {
  it('preserves autoescape when on', () => {
    const result = djanjucks.renderString(
      '{{ a|wordwrap:"3" }} {{ b|wordwrap:"3" }}',
      {
        a: 'a & b',
        b: runtime.markSafe('a & b')
      }
    );
    expect(result).toEqual('a &amp;\nb a &\nb');
  });

  it('preserves autoescape', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|wordwrap:"3" }} {{ b|wordwrap:"3" }}{% endautoescape %}',
      {
        a: 'a & b',
        b: runtime.markSafe('a & b')
      }
    );
    expect(result).toEqual('a &\nb a &\nb');
  });

  it('wraps words', () => {
    const result = djanjucks.renderString('{{ value|wordwrap:"14" }}', {
      value:
        "this is a long paragraph of text that really needs to be wrapped I'm afraid"
    });
    expect(result).toEqual(
      'this is a long\nparagraph of\ntext that\nreally needs\nto be wrapped\nI&#39;m afraid'
    );
  });

  it('handles if the last char in a line is a space', () => {
    const result = djanjucks.renderString('{{ value|wordwrap:"7" }}', {
      value: 'this is a long paragraph of text'
    });
    expect(result).toEqual('this is\na long\nparagraph\nof text');
  });

  it("takes the entire word if the width is less than it's length", () => {
    const result = djanjucks.renderString('{{ value|wordwrap:"1" }}', {
      value: 'this is a long paragraph of text'
    });
    expect(result).toEqual('this\nis\na\nlong\nparagraph\nof\ntext');
  });

  it('does not add a linebreak to the last split', () => {
    const result = djanjucks.renderString('{{ value|wordwrap:"7" }}', {
      value: 'this is\na long\nparagraph\nof text\n'
    });
    expect(result).toEqual('this is\na long\nparagraph\nof text\n');
  });

  it('preserves existing linebreaks 2', () => {
    const result = djanjucks.renderString('{{ value|wordwrap:"15" }}', {
      value:
        'this is a short paragraph of text.\n  But this line should be indented'
    });
    expect(result).toEqual(
      'this is a short\nparagraph of\ntext.\n  But this line\nshould be\nindented'
    );
  });

  it('parses the value to a string', () => {
    const result = djanjucks.renderString('{{ value|wordwrap:"3" }}', {
      value: 123
    });
    expect(result).toEqual('123');
  });
});
