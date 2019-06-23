import djanjucks from '../../src';

describe('autoescape tag', () => {
  it('escapes when set to "on"', () => {
    const result = djanjucks.renderString(
      '{% autoescape on %}{{ value }}{% endautoescape %}',
      {
        value: '<button>Test</button>'
      }
    );

    expect(result).toEqual('&lt;button&gt;Test&lt;/button&gt;');
  });

  it('does not escape when set to "off"', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ value }}{% endautoescape %}',
      {
        value: '<button>Test</button>'
      }
    );

    expect(result).toEqual('<button>Test</button>');
  });

  it('parses arg as a lookup value if not "on" or "off"', () => {
    const result = djanjucks.renderString(
      '{% autoescape state %}{{ value }}{% endautoescape %}',
      {
        value: '<button>Test</button>',
        state: 'off'
      }
    );

    expect(result).toEqual('<button>Test</button>');
  });
});
