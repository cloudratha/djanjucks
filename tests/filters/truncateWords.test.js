import djanjucks, { runtime } from '../../src';

describe('truncatewords filter', () => {
  it('truncates to words', () => {
    const result = djanjucks.renderString(
      '{{ a|truncatewords:"2" }} {{ b|truncatewords:"2"}}',
      {
        a: 'alpha & bravo',
        b: runtime.markSafe('alpha &amp; bravo')
      }
    );
    expect(result).toEqual('alpha &amp; ... alpha &amp; ...');
  });

  it('truncates to words with autoescape off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|truncatewords:"2" }} {{ b|truncatewords:"2"}}{% endautoescape %}',
      {
        a: 'alpha & bravo',
        b: runtime.markSafe('alpha &amp; bravo')
      }
    );
    expect(result).toEqual('alpha & ... alpha &amp; ...');
  });

  it('truncates to the first word', () => {
    const result = djanjucks.renderString('{{ value|truncatewords:"1" }}', {
      value: 'A sentence with a few words in it'
    });
    expect(result).toEqual('A ...');
  });

  it('truncates to the first 5 words', () => {
    const result = djanjucks.renderString('{{ value|truncatewords:"5" }}', {
      value: 'A sentence with a few words in it'
    });
    expect(result).toEqual('A sentence with a few ...');
  });

  it('returns the entire text if arg is larger than max word count', () => {
    const result = djanjucks.renderString('{{ value|truncatewords:"100" }}', {
      value: 'A sentence with a few words in it'
    });
    expect(result).toEqual('A sentence with a few words in it');
  });

  it('returns the entire text if the arg is not a number', () => {
    const result = djanjucks.renderString('{{ value|truncatewords:"x" }}', {
      value: 'A sentence with a few words in it'
    });
    expect(result).toEqual('A sentence with a few words in it');
  });

  it('accepts raw number arg', () => {
    const result = djanjucks.renderString('{{ value|truncatewords:3 }}', {
      value: 'A sentence with a few words in it'
    });
    expect(result).toEqual('A sentence with ...');
  });
});
