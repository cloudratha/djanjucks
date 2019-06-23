import djanjucks from '../../src';

describe('spaceless tag', () => {
  it('strips whitespaces between html tags', () => {
    const result = djanjucks.renderString(`{% spaceless %}
<ul>
  <li>Test</li>
</ul>
{% endspaceless %}`);

    expect(result).toEqual('<ul><li>Test</li></ul>');
  });
});
