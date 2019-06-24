import djanjucks from '../../src';

describe('for tag', () => {
  it('iterates a list', () => {
    const result = djanjucks.renderString(
      `{% for item in items %}{{ item }}{% endfor %}`,
      {
        items: ['A', 'B', 'C']
      }
    );

    expect(result).toEqual('ABC');
  });

  it('iterates an object', () => {
    const result = djanjucks.renderString(
      `{% for ingredient, quantity in items %}{{ ingredient }}:{{ quantity }},{% endfor %}`,
      {
        items: {
          ketchup: 1,
          mustard: 2,
          mayo: 0
        }
      }
    );

    expect(result).toEqual('ketchup:1,mustard:2,mayo:0,');
  });

  it('unpacks variables', () => {
    const result = djanjucks.renderString(
      `{% for x, y, z in items %}{{ x }},{{ y }},{{ z }}:{% endfor %}`,
      {
        items: [[0, 1, 2], [5, 6, 7], [12, 13, 14]]
      }
    );

    expect(result).toEqual('0,1,2:5,6,7:12,13,14:');
  });

  it('has access to special variables', () => {
    const result = djanjucks.renderString(
      `{% for item in items %}
{{ forloop.index }}:{{ forloop.index0 }}:{{ forloop.revindex }}:{{ forloop.revindex0 }}
{{ forloop.first }}:{{ forloop.last }}:{{ forloop.length }}
{% endfor %}`,
      {
        items: ['A', 'B', 'C']
      }
    );

    expect(result.trim()).toEqual(`1:0:3:2
true:false:3

2:1:2:1
false:false:3

3:2:1:0
false:true:3`);
  });

  it('supports empty inner tag', () => {
    const result = djanjucks.renderString(
      `{% for item in items %}not empty{% empty %}empty{% endfor %}`,
      {
        items: []
      }
    );

    expect(result).toEqual('empty');
  });

  it('reverses the array with the keyword', () => {
    const result = djanjucks.renderString(
      `{% for item in items reversed %}{{ item }}{% endfor %}`,
      {
        items: ['1', '2', '3']
      }
    );

    expect(result).toEqual('321');
  });
});
