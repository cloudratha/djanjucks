import djanjucks from '../../src';

describe('with tag', () => {
  it('creates the context', () => {
    const result = djanjucks.renderString(
      '{% with total=item.total %}{{ total }}{% endwith %}',
      {
        item: {
          total: 100
        }
      }
    );

    expect(result).toEqual('100');
  });

  it('only makes available the context for the body', () => {
    const result = djanjucks.renderString(
      '{% with total=item.total %}{{ total }}{% endwith %}{{ total }}',
      {
        item: {
          total: 100
        }
      }
    );

    expect(result).toEqual('100');
  });

  it('temporarily overrides existing context variable names', () => {
    const result = djanjucks.renderString(
      '{% with total=item.total %}{{ total }}{% endwith %}{{ total }}',
      {
        item: {
          total: 100
        },
        total: 123
      }
    );

    expect(result).toEqual('100123');
  });

  it('supports binding output to context', () => {
    const result = djanjucks.renderString(
      '{% with item.total as total%}{{ total }}{% endwith %}{{ total }}',
      {
        item: {
          total: 100
        },
        total: 123
      }
    );

    expect(result).toEqual('100123');
  });
});
