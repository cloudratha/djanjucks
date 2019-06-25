import djanjucks, { runtime } from '../../src';

describe('iriencode filter', () => {
  it('encodes querystring', () => {
    const result = djanjucks.renderString('{{ url|iriencode }}', {
      url: '?test=1&me=2'
    });
    expect(result).toEqual('?test=1&amp;me=2');
  });

  it('preserves autoescaping', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ url|iriencode }}{% endautoescape %}',
      {
        url: '?test=1&me=2'
      }
    );
    expect(result).toEqual('?test=1&me=2');
  });

  it('preserves incoming string safeness', () => {
    const result = djanjucks.renderString('{{ url|iriencode }}', {
      url: runtime.markSafe('?test=1&me=2')
    });
    expect(result).toEqual('?test=1&me=2');
  });

  it('preserves autoescaping with safe value', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ url|iriencode }}{% endautoescape %}',
      {
        url: runtime.markSafe('?test=1&me=2')
      }
    );
    expect(result).toEqual('?test=1&me=2');
  });

  it('encodes correctly', () => {
    const result = djanjucks.renderString('{{ url|iriencode }}', {
      url: 'S\xf8r-Tr\xf8ndelag'
    });
    expect(result).toEqual('S%C3%B8r-Tr%C3%B8ndelag');
  });

  it('encodes correctly 2', () => {
    const result = djanjucks.renderString('{{ url|iriencode }}', {
      url: encodeURIComponent('fran\xe7ois & jill')
    });
    expect(result).toEqual('fran%C3%A7ois%20%26%20jill');
  });
});
