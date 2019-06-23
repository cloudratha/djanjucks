import djanjucks from '../../src';

describe('load tag', () => {
  it('ignores the tag completely', () => {
    const result = djanjucks.renderString(`{% load dependency %}`);
    expect(result).toEqual('');
  });
});
