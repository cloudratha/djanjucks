import djanjucks from '../../src';

describe('comment tag', () => {
  it('comments body', () => {
    const result = djanjucks.renderString(
      '{% comment %}Hello World{% endcomment %}'
    );

    expect(result).toEqual('<!-- Hello World -->');
  });

  it('supports multiline comments', () => {
    const result = djanjucks.renderString(
      `{% comment %}Hello
World
{% endcomment %}`
    );

    expect(result).toEqual(`<!-- Hello
World
 -->`);
  });

  it('supports parsing in body', () => {
    const result = djanjucks.renderString(
      `{% comment %}Hello {{ username }}{% endcomment %}`,
      {
        username: 'John'
      }
    );

    expect(result).toEqual(`<!-- Hello John -->`);
  });

  it('supports a title argument', () => {
    const result = djanjucks.renderString(
      `{% comment 'Some Comment' %}Hello World{% endcomment %}`
    );

    expect(result).toEqual(`<!-- Some Comment
Hello World -->`);
  });
});
