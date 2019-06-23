import djanjucks from '../../src';

describe('linebreaks filter', () => {
  it('removes all occurences of string', () => {
    const result = djanjucks.renderString('{{ value|linebreaks }}', {
      value: `Hello

World`
    });
    expect(result).toEqual(`<p>Hello</p>
<p>World</p>`);
  });
});
