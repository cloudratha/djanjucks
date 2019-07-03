import djanjucks from '../../src';

describe('truncatechars filter', () => {
  it('truncates value to 5', () => {
    const result = djanjucks.renderString('{{ value|truncatechars:5 }}', {
      value: 'Testing, testing'
    });
    expect(result).toEqual('Te...');
  });

  it('does not add ellipsis if unnecessary', () => {
    const result = djanjucks.renderString('{{ value|truncatechars:7 }}', {
      value: 'Testing'
    });
    expect(result).toEqual('Testing');
  });

  it('fails silently if arg is non number', () => {
    const result = djanjucks.renderString('{{ value|truncatechars:"e" }}', {
      value: 'Testing, testing'
    });
    expect(result).toEqual('Testing, testing');
  });
});
