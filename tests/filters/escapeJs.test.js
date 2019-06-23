import djanjucks from '../../src';

describe('escapejs filter', () => {
  it('escapes a string for use in js', () => {
    const result = djanjucks.renderString('{{ value|escapejs }}', {
      value: 'testing\r\njavascript \'string" <b>escaping</b>'
    });
    expect(result).toEqual(
      'testing\\u000D\\u000Ajavascript \\u0027string\\u0022 \\u003Cb\\u003Eescaping\\u003C/b\\u003E'
    );
  });

  it('escapes even when global autoescape is true', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|escapejs }}{% endautoescape %}',
      {
        value: 'testing\r\njavascript \'string" <b>escaping</b>'
      }
    );
    expect(result).toEqual(
      'testing\\u000D\\u000Ajavascript \\u0027string\\u0022 \\u003Cb\\u003Eescaping\\u003C/b\\u003E'
    );
  });

  it('escapes single and double quotes', () => {
    const result = djanjucks.renderString('{{ value|escapejs }}', {
      value: '"double quotes" and \'single quotes\''
    });
    expect(result).toEqual(
      '\\u0022double quotes\\u0022 and \\u0027single quotes\\u0027'
    );
  });

  it('escapes backslashes', () => {
    const result = djanjucks.renderString('{{ value|escapejs }}', {
      value: '\\ : backslashes, too'
    });
    expect(result).toEqual('\\u005C : backslashes, too');
  });

  it('escapes escape sequences', () => {
    const result = djanjucks.renderString('{{ value|escapejs }}', {
      value: 'and lots of whitespace: \r\n\t\v\f\b'
    });
    expect(result).toEqual(
      'and lots of whitespace: \\u000D\\u000A\\u0009\\u000B\\u000C\\u0008'
    );
  });

  it('escapes script tag', () => {
    const result = djanjucks.renderString('{{ value|escapejs }}', {
      value: '<script>and this</script>'
    });
    expect(result).toEqual('\\u003Cscript\\u003Eand this\\u003C/script\\u003E');
  });

  it('escapes paragraph and line separators', () => {
    const result = djanjucks.renderString('{{ value|escapejs }}', {
      value: 'paragraph separator:\u2029and line separator:\u2028'
    });
    expect(result).toEqual(
      'paragraph separator:\\u2029and line separator:\\u2028'
    );
  });
});
