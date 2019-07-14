import djanjucks, { runtime } from '../../src';

describe('cycle tag', () => {
  it('requires a target if provided as keyword', () => {
    expect(() => {
      djanjucks.renderString('{% cycle "a" as %}');
    }).toThrow('cycle: Expected cycle name after keyword "as".');
  });

  it('requires at least one argument', () => {
    expect(() => {
      djanjucks.renderString('{% cycle %}');
    }).toThrow('cycle: Requires at least one argument.');
  });

  it('only accepets single flag', () => {
    expect(() => {
      djanjucks.renderString('{% cycle "a" as a silent test %}');
    }).toThrow(
      'cycle: Only a single "silent" flag is allowed, not "[silent, test]".'
    );
  });

  it('looks for named cycles in template', () => {
    expect(() => {
      djanjucks.renderString('{% cycle a %}');
    }).toThrow('cycle: No named cycles in template. "a" is not defined.');
  });

  it('can add the named cycle to context', () => {
    const result = djanjucks.renderString(
      '{% cycle "a" "b" "c" as foo %}{% cycle foo %}'
    );
    expect(result).toEqual('ab');
  });

  it('can chain the same named cycle [2]', () => {
    const result = djanjucks.renderString(
      '{% cycle "a" "b" "c" as foo %}{% cycle foo %}{% cycle foo %}'
    );
    expect(result).toEqual('abc');
  });

  it('can chain the same named cycle [3]', () => {
    const result = djanjucks.renderString(
      '{% cycle "a" "b" "c" as foo %}{% cycle foo %}{% cycle foo %}{% cycle foo %}'
    );
    expect(result).toEqual('abca');
  });

  it('cycles in a forloop', () => {
    const result = djanjucks.renderString(
      '{% for i in value %}{% cycle "a" "b" %}{{ i }},{% endfor %}',
      {
        value: [0, 1, 2, 3, 4]
      }
    );
    expect(result).toEqual('a0,b1,a2,b3,a4,');
  });

  it('takes multiple context vars as arguments', () => {
    const result = djanjucks.renderString(
      '{% cycle one two as foo %}{% cycle foo %}',
      {
        one: '1',
        two: '2'
      }
    );
    expect(result).toEqual('12');
  });

  it('takes multiple context vars as arguments in a forloop', () => {
    const result = djanjucks.renderString(
      '{% for i in value %}{% cycle one two %}{{ i }},{% endfor %}',
      {
        value: [0, 1, 2, 3, 4],
        one: 'a',
        two: 'b'
      }
    );
    expect(result).toEqual('a0,b1,a2,b3,a4,');
  });

  it('filters arguments', () => {
    const result = djanjucks.renderString(
      '{% cycle one|lower two as foo %}{% cycle foo %}',
      {
        one: 'A',
        two: '2'
      }
    );
    expect(result).toEqual('a2');
  });

  it('supresses output with silent', () => {
    const result = djanjucks.renderString(
      '{% cycle "a" "b" "c" as abc silent %}{% cycle abc %}{% cycle abc %}{% cycle abc %}{% cycle abc %}'
    );
    expect(result).toEqual('');
  });

  it('only accepts silent as a flag', () => {
    expect(() => {
      djanjucks.renderString('{% cycle "a" "b" "c" as abc flag %}');
    }).toThrow(
      'cycle: Only "silent" flag is allowed after cycle name, not "flag".'
    );
  });

  it('does not silence if named cycle is "silent"', () => {
    const result = djanjucks.renderString(
      '{% cycle "a" "b" as silent %}{% cycle silent %}'
    );
    expect(result).toEqual('ab');
  });

  it('escapes preserves autoescape', () => {
    const result = djanjucks.renderString(
      '{% cycle one two as foo %} & {% cycle foo %}',
      {
        one: 'A & B',
        two: runtime.markSafe('C & D')
      }
    );
    expect(result).toEqual('A &amp; B & C & D');
  });

  it('escapes preserves autoescape with off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{% cycle one two as foo %} & {% cycle foo %}{% endautoescape %}',
      {
        one: 'A & B',
        two: runtime.markSafe('C & D')
      }
    );
    expect(result).toEqual('A & B & C & D');
  });

  it('cycles in a loop', () => {
    const result = djanjucks.renderString(
      '{% for x in values %}{% cycle "A" "B" "C" %}{{ x }}{% endfor %}',
      {
        values: [1, 2, 3, 4]
      }
    );
    expect(result).toEqual('A1B2C3A4');
  });

  it('cycles in a loop with target', () => {
    const result = djanjucks.renderString(
      '{% for x in values %}{% cycle "A" "B" "C" as output silent %}{{ x }}{{ output }}{% endfor %}',
      {
        values: [1, 2, 3, 4]
      }
    );
    expect(result).toEqual('1A2B3C4A');
  });

  it('cycles a lookup value with target', () => {
    const result = djanjucks.renderString('{% cycle value as foo %}', {
      value: '<'
    });
    expect(result).toEqual('&lt;');
  });

  it('allows filtering on arguments', () => {
    const result = djanjucks.renderString(
      '{% cycle a|safe b as ab %}{% cycle ab %}',
      {
        a: '<',
        b: '>'
      }
    );
    expect(result).toEqual('<&gt;');
  });

  it('supports ifchanged', () => {
    const result = djanjucks.renderString(
      [
        '{% cycle "a" "b" "c" as cycler silent %}',
        '{% for x in values %}',
        '{% ifchanged x %}',
        '{% cycle cycler %}',
        '{{ cycler }}',
        '{% else %}',
        '{{ cycler }}',
        '{% endifchanged %}',
        '{% endfor %}'
      ].join(''),
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 9, 9]
      }
    );
    expect(result).toEqual('bcabcabcccaa');
  });

  // it('should not reset when used in "with" tag', () => {
  //   const result = djanjucks.renderString(
  //     [
  //       '{% cycle "a" "b" "c" as cycler silent %}',
  //       '{% for x in values %}',
  //       '{% with doesnothing=irrelevant %}',
  //       '{% ifchanged x %}',
  //       '{% cycle cycler %}',
  //       '{{ cycler }}',
  //       '{% else %}',
  //       '{{ cycler }}',
  //       '{% endifchanged %}',
  //       '{% endwith %}',
  //       '{% endfor %}'
  //     ].join(''),
  //     {
  //       irrelevant: 1,
  //       values: [1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 9, 9]
  //     }
  //   );
  //   expect(result).toEqual('bcabcabcccaa');
  // });
});
