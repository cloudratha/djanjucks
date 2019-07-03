import djanjucks from '../../src';

describe('truncatechars_html filter', () => {
  it('returns ellipsis when length is 0 for some reason', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatechars_html:0 }}{% endautoescape %}',
      {
        value: '<p>one <a href="#">two - three <br>four</a> five</p>'
      }
    );
    expect(result).toEqual('...');
  });

  it('removes other html if beyond truncate', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatechars_html:6 }}{% endautoescape %}',
      {
        value: '<p>one <a href="#">two - three <br>four</a> five</p>'
      }
    );
    expect(result).toEqual('<p>one...</p>');
  });

  it('does not add ellipsis if unnecessary', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatechars_html:100 }}{% endautoescape %}',
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
      '{% autoescape off %}{{ value|truncatechars_html:5 }}{% endautoescape %}',
      {
        value: '<b>\xc5ngstr\xf6m</b> was here'
      }
    );
    expect(result).toEqual('<b>\xc5n...</b>');
  });

  it('just works', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|truncatechars_html:3 }}{% endautoescape %}',
      {
        value: 'a<b>b</b>c'
      }
    );
    expect(result).toEqual('a<b>b</b>c');
  });
});
