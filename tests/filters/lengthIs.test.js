import djanjucks from '../../src';

describe('length_is filter', () => {
  it('returns true if length matches', () => {
    const result = djanjucks.renderString('{{ "four"|length_is:"4" }}');
    expect(result).toEqual('true');
  });

  it('returns false if length does not matches', () => {
    const result = djanjucks.renderString('{{ "four"|length_is:"5" }}');
    expect(result).toEqual('false');
  });

  it('returns empty string if arg is not a number', () => {
    const result = djanjucks.renderString('{{ "four"|length_is:"s" }}');
    expect(result).toEqual('');
  });

  it('can be used in an if statement', () => {
    const result = djanjucks.renderString(
      '{% if value|length_is:"3" %}correct{% else %}incorrect{% endif %}',
      {
        value: [1, 2, 3]
      }
    );
    expect(result).toEqual('correct');
  });

  it('can be used in an if statement 2', () => {
    const result = djanjucks.renderString(
      '{% if value|length_is:"3" %}correct{% else %}incorrect{% endif %}',
      {
        value: 'four'
      }
    );
    expect(result).toEqual('incorrect');
  });

  it('can be assigned', () => {
    const result = djanjucks.renderString(
      '{% set test = value|length_is:"3" %}{{ test }}',
      {
        value: 'one'
      }
    );
    expect(result).toEqual('true');
  });

  it('retuns an empty string if value doesn not have a length', () => {
    const result = djanjucks.renderString('{{ value|length_is:"3" }}', {
      value: 1
    });
    expect(result).toEqual('');
  });
});
