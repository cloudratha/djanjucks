import djanjucks, { runtime } from '../../src';

describe('slugify filter', () => {
  it('renders value and preserves autoescape', () => {
    const result = djanjucks.renderString('{{ a|slugify }} {{ b|slugify }}', {
      a: 'a & b',
      b: runtime.markSafe('a &amp; b')
    });
    expect(result).toEqual('a-b a-amp-b');
  });

  it('renders value and preserves global autoescape', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|slugify }} {{ b|slugify }}{% endautoescape %}',
      {
        a: 'a & b',
        b: runtime.markSafe('a &amp; b')
      }
    );
    expect(result).toEqual('a-b a-amp-b');
  });

  it('evaluates encoded strings', () => {
    const result = djanjucks.renderString('{{ value|slugify }}', {
      value: "Un \xe9l\xe9phant \xe0 l'or\xe9e du bois"
    });
    expect(result).toEqual('un-elephant-a-loree-du-bois');
  });

  it('renders with no special characters', () => {
    const result = djanjucks.renderString('{{ value|slugify }}', {
      value: ' Jack & Jill like numbers 1,2,3 and 4 and silly characters ?%.$!/'
    });
    expect(result).toEqual(
      'jack-jill-like-numbers-123-and-4-and-silly-characters'
    );
  });
});
