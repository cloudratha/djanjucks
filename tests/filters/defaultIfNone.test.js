import djanjucks from '../../src';

describe('default_if_none filter', () => {
  it('returns value if not null', () => {
    const result = djanjucks.renderString(
      '{{ value|default_if_none:"default" }}',
      {
        value: 'test'
      }
    );
    expect(result).toEqual('test');
  });

  it('returns value if value is falsy', () => {
    const result = djanjucks.renderString(
      '{{ value|default_if_none:"default" }}',
      {
        value: ''
      }
    );
    expect(result).toEqual('');
  });

  it('returns value if value is non string', () => {
    const result = djanjucks.renderString(
      '{{ value|default_if_none:"default" }}',
      {
        value: 123
      }
    );
    expect(result).toEqual('123');
  });

  it('returns arf if value is null', () => {
    const result = djanjucks.renderString(
      '{{ value|default_if_none:"default" }}',
      {
        value: null
      }
    );
    expect(result).toEqual('default');
  });
});
