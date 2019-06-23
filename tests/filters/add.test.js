import djanjucks from '../../src';

describe('add filter', () => {
  it('concats strings', () => {
    const result = djanjucks.renderString('{{ "Hello"|add:"World" }}');
    expect(result).toEqual('HelloWorld');
  });

  it('adds numbers', () => {
    const result = djanjucks.renderString('{{ 1|add:3 }}');
    expect(result).toEqual('4');
  });

  it('concats arrays', () => {
    const result = djanjucks.renderString(
      '{% set temp = first|add:second %}{{ temp|join:":" }}',
      {
        first: ['first'],
        second: ['second']
      }
    );
    expect(result).toEqual('first:second');
  });
});
