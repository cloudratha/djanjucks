import djanjucks, { runtime } from '../../src';

describe('resetcycle tag', () => {
  it('throws error if no cycle is available', () => {
    expect(() => {
      djanjucks.renderString('{% resetcycle %}');
    }).toThrow('resetcycle: No named cycle in template.');
  });

  it('throws error if no named cycle is available', () => {
    expect(() => {
      djanjucks.renderString('{% cycle "a" "b" %}{% resetcycle undefined %}');
    }).toThrow('resetcycle: No named cycle in template called "undefined".');
  });

  it('resets the last cycle', () => {
    const result = djanjucks.renderString(
      '{% for i in values %}{% cycle "a" "b" "c" %}{% resetcycle %}{% endfor %}',
      {
        values: [0, 1, 2, 3]
      }
    );
    expect(result).toEqual('aaaa');
  });

  it('resets the last cycle even if named', () => {
    const result = djanjucks.renderString(
      '{% for i in values %}{% cycle "a" "b" "c" as target %}{% resetcycle %}{% endfor %}',
      {
        values: [0, 1, 2, 3]
      }
    );
    expect(result).toEqual('aaaa');
  });

  it('resets the a named cycle', () => {
    const result = djanjucks.renderString(
      '{% for i in values %}{% cycle "a" "b" "c" as target %}{% resetcycle target %}{% endfor %}',
      {
        values: [0, 1, 2, 3]
      }
    );
    expect(result).toEqual('aaaa');
  });

  it('resets the last cycle in a loop', () => {
    const result = djanjucks.renderString(
      [
        '{% cycle "a" "b" "c" as abc %}',
        '{% for i in values %}',
        '{% cycle abc %}',
        '{% cycle "-" "+" %}',
        '{% resetcycle %}',
        '{% endfor %}'
      ].join(''),
      {
        values: [0, 1, 2, 3, 4]
      }
    );
    expect(result).toEqual('ab-c-a-b-c-');
  });

  it('resets the named cycle in a loop', () => {
    const result = djanjucks.renderString(
      [
        '{% cycle "a" "b" "c" as abc %}',
        '{% for i in values %}',
        '{% resetcycle abc %}',
        '{% cycle abc %}',
        '{% cycle "-" "+" %}',
        '{% endfor %}'
      ].join(''),
      {
        values: [0, 1, 2, 3, 4]
      }
    );
    expect(result).toEqual('aa-a+a-a+a-');
  });

  it('resets the cycle in a loop', () => {
    const result = djanjucks.renderString(
      [
        '{% for i in outer %}',
        '{% for j in inner %}',
        '{% cycle "a" "b" %}',
        '{% endfor %}',
        '{% resetcycle %}',
        '{% endfor %}'
      ].join(''),
      {
        outer: [0, 1],
        inner: [2, 3, 4]
      }
    );
    expect(result).toEqual('abaaba');
  });
});
