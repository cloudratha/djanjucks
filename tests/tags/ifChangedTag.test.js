import djanjucks from '../../src';

describe('ifchanged tag', () => {
  it('renders on first evaluation', () => {
    const result = djanjucks.renderString(
      `{% for item in items %}{% ifchanged %}{{ item }}{% endifchanged %}{% endfor %}`,
      {
        items: ['A', 'B']
      }
    );
    expect(result).toEqual('AB');
  });

  it('renders only if values have changed', () => {
    const result = djanjucks.renderString(
      `{% for item in items %}{% ifchanged %}{{ item }}{% endifchanged %}{% endfor %}`,
      {
        items: ['A', 'A', 'B', 'A', 'C', 'C']
      }
    );
    expect(result).toEqual('ABAC');
  });

  it('renders in nested for loops', () => {
    const result = djanjucks.renderString(
      `{% for n in num %}{% ifchanged %}{{ n }}{% endifchanged %}
{% for x in numx %}{% ifchanged %}{{ x }}{% endifchanged %}
{% endfor %}{% endfor %}`,
      {
        num: [1, 2, 3],
        numx: [2, 2, 2]
      }
    );

    expect(result.replace(/\n/g, '')).toEqual('122232');
  });

  it('renders in nested for loops', () => {
    const result = djanjucks.renderString(
      `{% for n in num %}{% ifchanged %}{{ n }}{% endifchanged %}
{% for x in numx %}{% ifchanged %}{{ x }}{% endifchanged %}
{% endfor %}{% endfor %}`,
      {
        num: [1, 1, 1],
        numx: [1, 2, 3]
      }
    );

    expect(result.replace(/\n/g, '')).toEqual('1123123123');
  });

  it('renders in deeply nested for loops', () => {
    const result = djanjucks.renderString(
      [
        '{% for n in num %}{% ifchanged %}{{ n }}{% endifchanged %}',
        '{% for x in numx %}{% ifchanged %}{{ x }}{% endifchanged %}',
        '{% for y in numy %}{% ifchanged %}{{ y }}{% endifchanged %}',
        '{% endfor %}{% endfor %}{% endfor %}'
      ].join(''),
      {
        num: [1, 1, 1],
        numx: [2, 2, 2],
        numy: [3, 3, 3]
      }
    );

    expect(result.replace(/\n/g, '')).toEqual('1233323332333');
  });

  it('evaluates key value pairs in loops', () => {
    const result = djanjucks.renderString(
      `{% for data in datalist %}{% for c,d in data %}
{% if c %}{% ifchanged %}{{ d }}{% endifchanged %}
{% endif %}{% endfor %}{% endfor %}`,
      {
        datalist: [
          [[1, 'a'], [1, 'a'], [0, 'b'], [1, 'c']],
          [[0, 'a'], [1, 'c'], [1, 'd'], [1, 'd'], [0, 'e']]
        ]
      }
    );

    expect(result.replace(/\n/g, '')).toEqual('accd');
  });

  it('evaluates single arg', () => {
    const result = djanjucks.renderString(
      `{% for n in num %}{% ifchanged n %}..{% endifchanged %}
{{ n }}{% endfor %}`,
      {
        num: [1, 2, 3]
      }
    );
    expect(result.replace(/\n/g, '')).toEqual('..1..2..3');
  });

  it('evaluates single arg', () => {
    const result = djanjucks.renderString(
      `{% for n in num %}{% for x in numx %}{% ifchanged n %}..{% endifchanged %}
{{ x }}{% endfor %}{% endfor %}`,
      {
        num: [1, 2, 3],
        numx: [5, 6, 7]
      }
    );
    expect(result.replace(/\n/g, '')).toEqual('..567..567..567');
  });

  it('evaluates multiple args', () => {
    const result = djanjucks.renderString(
      `{% for n in num %}{{ n }}{% for x in numx %}
{% ifchanged x n %}{{ x }}{% endifchanged %}
{% endfor %}{% endfor %}`,
      {
        num: [1, 1, 2],
        numx: [5, 6, 6]
      }
    );
    expect(result.replace(/\n/g, '')).toEqual('156156256');
  });

  it('evaluates multiple args individually', () => {
    const result = djanjucks.renderString(
      `{% for d in days %}{% ifchanged %}{{ d.day }}{% endifchanged %}
{% for h in d.hours %}{% ifchanged d h %}{{ h }}{% endifchanged %}
{% endfor %}{% endfor %}`,
      {
        days: [{ hours: [1, 2, 3], day: 1 }, { hours: [3], day: 2 }]
      }
    );
    expect(result.replace(/\n/g, '')).toEqual('112323');
  });

  it('renders the else clause if unchanged', () => {
    const result = djanjucks.renderString(
      `{% for id in ids %}{{ id }}
{% ifchanged id %}-first{% else %}-other{% endifchanged %}
,{% endfor %}`,
      {
        ids: [1, 1, 2, 2, 2, 3]
      }
    );
    expect(result.replace(/\n/g, '')).toEqual(
      '1-first,1-other,2-first,2-other,2-other,3-first,'
    );
  });

  it('evaluates args with filters', () => {
    const result = djanjucks.renderString(
      `{% for item in list %}
{% ifchanged item|upper %}{{ item }}{% endifchanged %}
{% endfor %}`,
      {
        list: ['a', 'A', 'C', 'a', 'D', 'd']
      }
    );
    expect(result.replace(/\n/g, '')).toEqual('aCaD');
  });
});
