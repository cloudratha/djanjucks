import djanjucks from '../../src';

describe('truncatewords_html filter', () => {
  it('returns empty string if arg is 0', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatewords_html:0 }}{% endautoescape %}',
      {
        value: '<p>one <a href="#">two - three <br>four</a> five</p>'
      }
    );
    expect(result).toEqual('');
  });

  it('removes other html if beyond truncate', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatewords_html:2 }}{% endautoescape %}',
      {
        value: '<p>one <a href="#">two - three <br>four</a> five</p>'
      }
    );
    expect(result).toEqual('<p>one <a href="#">two ...</a></p>');
  });

  it('handles self closing tags', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatewords_html:4 }}{% endautoescape %}',
      {
        value: '<p>one <a href="#">two - three <br>four</a> five</p>'
      }
    );
    expect(result).toEqual(
      '<p>one <a href="#">two - three <br>four ...</a></p>'
    );
  });

  it('returns the entire string if arg is larger than word count', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatewords_html:100 }}{% endautoescape %}',
      {
        value: '<p>one <a href="#">two - three <br>four</a> five</p>'
      }
    );
    expect(result).toEqual(
      '<p>one <a href="#">two - three <br>four</a> five</p>'
    );
  });

  it('supports unicodes', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatewords_html:1 }}{% endautoescape %}',
      {
        value: '\xc5ngstr\xf6m was here'
      }
    );
    expect(result).toEqual('\xc5ngstr\xf6m ...');
  });

  it('just works', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatewords_html:3 }}{% endautoescape %}',
      {
        value: '<i>Buenos d&iacute;as! &#x00bf;C&oacute;mo est&aacute;?</i>'
      }
    );
    expect(result).toEqual(
      '<i>Buenos d&iacute;as! &#x00bf;C&oacute;mo ...</i>'
    );
  });

  it('returns the entire string if arf is not a number', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatewords_html:"x" }}{% endautoescape %}',
      {
        value: '<p>string</p>'
      }
    );
    expect(result).toEqual('<p>string</p>');
  });
});
