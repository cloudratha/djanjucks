import djanjucks from '../../src';

describe('include tag', () => {
  beforeAll(() => {
    const template = 'item {{ value }}';
    // Evaluate template to window context
    window.eval(djanjucks.precompileString(template, { name: 'item.html' }));
  });

  it('imports template', () => {
    const result = djanjucks.renderString('{% include "item.html" %}');

    expect(result).toEqual('item ');
  });

  it('allows global context access', () => {
    const result = djanjucks.renderString('{% include "item.html" %}', {
      value: 123
    });

    expect(result).toEqual('item 123');
  });

  it('allows context variables passwed with "with"', () => {
    const result = djanjucks.renderString(
      '{% include "item.html" with value="hello" %}'
    );

    expect(result).toEqual('item hello');
  });

  it('passed context is not available outside include', () => {
    const result = djanjucks.renderString(
      '{% include "item.html" with value="hello" %}:{{ value }}'
    );

    expect(result).toEqual('item hello:');
  });

  it('only allows passed context with keyword "only"', () => {
    const result = djanjucks.renderString(
      '{% include "item.html" with value="hello" only %}{{ value }}',
      {
        value: 123
      }
    );

    expect(result).toEqual('item hello123');
  });
});
