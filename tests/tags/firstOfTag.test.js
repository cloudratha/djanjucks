import djanjucks from '../../src';

describe('firstof tag', () => {
  it('returns first truthy value', () => {
    const result = djanjucks.renderString('{% firstof value value2 %}', {
      value: false,
      value2: 'correct'
    });

    expect(result).toEqual('correct');
  });

  it('parses strings and variables', () => {
    const result = djanjucks.renderString('{% firstof value "default" %}', {
      value: false
    });

    expect(result).toEqual('default');
  });

  it('returns blank string if all falsey values', () => {
    const result = djanjucks.renderString('{% firstof value %}', {
      value: false
    });

    expect(result).toEqual('');
  });

  it('can be assigned to a variable', () => {
    const result = djanjucks.renderString(
      '{% firstof value "name" as variable %}{{ variable }}',
      {
        value: false
      }
    );

    expect(result).toEqual('name');
  });
});
