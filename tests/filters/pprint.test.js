import djanjucks, { runtime } from '../../src';

describe('pprint filter', () => {
  it('prints a string', () => {
    const result = djanjucks.renderString('{{ value|pprint }}', {
      value: 'test'
    });
    expect(result).toEqual('"test"');
  });

  it('prints a number', () => {
    const result = djanjucks.renderString('{{ value|pprint }}', {
      value: 123
    });
    expect(result).toEqual('123');
  });

  it('prints an object', () => {
    const result = djanjucks.renderString('{{ value|pprint }}', {
      value: {
        name: 'test',
        total: 123
      }
    });
    expect(result).toEqual(`{
  "name": "test",
  "total": 123
}`);
  });

  it('prints a named function', () => {
    const func = function test() {
      return 'value';
    };
    const result = djanjucks.renderString('{{ value|pprint }}', {
      value: func
    });
    expect(result).toEqual('"[Function: test]"');
  });

  it('prints a function by var', () => {
    const func = function() {
      return 'value';
    };
    const result = djanjucks.renderString('{{ value|pprint }}', {
      value: func
    });
    expect(result).toEqual('"[Function: func]"');
  });

  it('prints an anonymous function by var', () => {
    const func = () => {
      return 'value';
    };
    const result = djanjucks.renderString('{{ value|pprint }}', {
      value: func
    });
    expect(result).toEqual('"[Function: func]"');
  });

  it('supports objects with methods', () => {
    const result = djanjucks.renderString('{{ value|pprint }}', {
      value: {
        name: 'test',
        price: 123,
        getPrice: () => {
          return this.price;
        }
      }
    });
    expect(result).toEqual(`{
  "name": "test",
  "price": 123,
  "getPrice": "[Function: getPrice]"
}`);
  });
});
