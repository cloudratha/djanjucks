import djanjucks from '../../src';

describe('safeseq filter', () => {
  it('marks items in arrays as safe', () => {
    const result = djanjucks.renderString(
      '{{ value|join:", " }} -- {{ value|safeseq|join:", " }}',
      {
        value: ['&', '<']
      }
    );
    expect(result).toEqual('&amp;, &lt; -- &, <');
  });

  it('is not affected by global autoescape', () => {
    const result = djanjucks.renderString(
      '{% autoescape on %}{{ value|join:", " }} -- {{ value|safeseq|join:", " }}{% endautoescape %}',
      {
        value: ['&', '<']
      }
    );
    expect(result).toEqual('&amp;, &lt; -- &, <');
  });

  it('is not affected by global autoescape', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value|join:", " }} -- {{ value|safeseq|join:", " }}{% endautoescape %}',
      {
        value: ['&', '<']
      }
    );
    expect(result).toEqual('&, < -- &, <');
  });
});
