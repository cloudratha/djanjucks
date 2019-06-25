import djanjucks, { runtime } from '../../src';

describe('phone2numeric filter', () => {
  it('preserves autoescape', () => {
    const result = djanjucks.renderString(
      '{{ a|phone2numeric }} {{ b|phone2numeric }}',
      {
        a: '<1-800-call-me>',
        b: runtime.markSafe('<1-800-call-me>')
      }
    );
    expect(result).toEqual('&lt;1-800-2255-63&gt; <1-800-2255-63>');
  });

  it('preserves autoescape with global off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|phone2numeric }} {{ b|phone2numeric }}{% endautoescape %}',
      {
        a: '<1-800-call-me>',
        b: runtime.markSafe('<1-800-call-me>')
      }
    );
    expect(result).toEqual('<1-800-2255-63> <1-800-2255-63>');
  });

  it('converts any arbitrary string', () => {
    const result = djanjucks.renderString('{{ value|phone2numeric }}', {
      value: 'How razorback-jumping frogs can level six piqued gymnasts!'
    });
    expect(result).toEqual(
      '469 729672225-5867464 37647 226 53835 749 747833 49662787!'
    );
  });
});
