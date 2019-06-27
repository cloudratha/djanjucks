import djanjucks, { runtime } from '../../src';

describe('slice filter', () => {
  it('slices value and preserves autoescape', () => {
    const result = djanjucks.renderString(
      '{{ a|slice:"1:3" }} {{ b|slice:"1:3" }}',
      {
        a: 'a&b',
        b: runtime.markSafe('a&b')
      }
    );
    expect(result).toEqual('&amp;b &b');
  });

  it('slices value and preserves global autoescape', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|slice:"1:3" }} {{ b|slice:"1:3" }}{% endautoescape %}',
      {
        a: 'a&b',
        b: runtime.markSafe('a&b')
      }
    );
    expect(result).toEqual('&b &b');
  });

  it('renders zero length', () => {
    const result = djanjucks.renderString('{{ value|slice:"0" }}', {
      value: 'abcdefg'
    });
    expect(result).toEqual('');
  });

  it('renders index', () => {
    const result = djanjucks.renderString('{{ value|slice:"1" }}', {
      value: 'abcdefg'
    });
    expect(result).toEqual('a');
  });

  it('renders index integer', () => {
    const result = djanjucks.renderString('{{ value|slice:arg }}', {
      value: 'abcdefg',
      arg: 1
    });
    expect(result).toEqual('a');
  });

  it('renders negative index', () => {
    const result = djanjucks.renderString('{{ value|slice:"-1" }}', {
      value: 'abcdefg'
    });
    expect(result).toEqual('abcdef');
  });

  it('renders range', () => {
    const result = djanjucks.renderString('{{ value|slice:"1:2" }}', {
      value: 'abcdefg'
    });
    expect(result).toEqual('b');
  });

  it('renders range multiple', () => {
    const result = djanjucks.renderString('{{ value|slice:"1:3" }}', {
      value: 'abcdefg'
    });
    expect(result).toEqual('bc');
  });

  it('renders range step', () => {
    const result = djanjucks.renderString('{{ value|slice:"0::2" }}', {
      value: 'abcdefg'
    });
    expect(result).toEqual('aceg');
  });

  it('slices an array', () => {
    const result = djanjucks.renderString('{{ value|slice:"1"|join:":" }}', {
      value: [1, 2, 3]
    });
    expect(result).toEqual('1');
  });

  it('slices an array range', () => {
    const result = djanjucks.renderString('{{ value|slice:"1:3"|join:":" }}', {
      value: [1, 2, 3]
    });
    expect(result).toEqual('2:3');
  });

  it('slices an array range with step', () => {
    const result = djanjucks.renderString('{{ value|slice:"::2"|join:":" }}', {
      value: [1, 2, 3, 4, 5, 6]
    });
    expect(result).toEqual('1:3:5');
  });
});
