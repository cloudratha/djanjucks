import djanjucks from '../../src';

describe('now tag', () => {
  it('ignores characters preceded by backslash', () => {
    // Because the string strips out the initial backslash, it is removed again after it's parsed.
    // This is taken into account in the loader, so for tests we double escape
    const result = djanjucks.renderString(`{% now "jS \\\\o\\\\f F" %}`);

    expect(result).toEqual(expect.stringContaining(' of '));
  });
});
