import djanjucks from '../../src';

describe('lorem tag', () => {
  it('generates default output', () => {
    const result = djanjucks.renderString('{% lorem %}');

    expect(result).toEqual(
      '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod </p>'
    );
  });

  it('generates 5 words', () => {
    const result = djanjucks.renderString('{% lorem 5 "w" %}');

    expect(result.split(' ')).toHaveLength(5);
  });

  it('generates 20 words randomly', () => {
    const result = djanjucks.renderString('{% lorem 20 "w" "random" %}');

    expect(result.split(' ')).toHaveLength(20);
  });

  it('generates 2 paragraphs', () => {
    const result = djanjucks.renderString('{% lorem 2 "p" %}');
    expect(result.split('\n')).toHaveLength(2);
  });
});
