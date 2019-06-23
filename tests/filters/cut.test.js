import djanjucks from '../../src';

describe('cut filter', () => {
  it('removes all occurences of string', () => {
    const result = djanjucks.renderString('{{ "Hello World"|cut:"l" }}');
    expect(result).toEqual('Heo Word');
  });
});
