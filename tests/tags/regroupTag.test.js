import djanjucks from '../../src';

const CITIES = [
  { name: 'Mumbai', population: '19,000,000', country: 'India' },
  { name: 'Calcutta', population: '15,000,000', country: 'India' },
  { name: 'New York', population: '20,000,000', country: 'USA' },
  { name: 'Chicago', population: '7,000,000', country: 'USA' },
  { name: 'Tokyo', population: '33,000,000', country: 'Japan' }
];

const CITIES_WITH_OBJECT = [
  {
    name: 'Mumbai',
    population: '19,000,000',
    country: { name: 'India', color: 'red' }
  },
  {
    name: 'Calcutta',
    population: '15,000,000',
    country: { name: 'India', color: 'blue' }
  },
  {
    name: 'New York',
    population: '20,000,000',
    country: { name: 'USA', color: 'yellow' }
  },
  {
    name: 'Chicago',
    population: '7,000,000',
    country: { name: 'USA', color: 'red' }
  },
  {
    name: 'Tokyo',
    population: '33,000,000',
    country: { name: 'Japan', color: 'yellow' }
  }
];

describe('regroup tag', () => {
  it('parses arguments without output', () => {
    const result = djanjucks.renderString(
      '{% regroup cities by country as country_list %}',
      {
        cities: CITIES
      }
    );
    expect(result).toEqual('');
  });

  it('fails when missing "by" keyword', () => {
    expect(() => {
      djanjucks.renderString('{% regroup cities as country_list %}', {
        cities: CITIES
      });
    }).toThrow();
  });

  it('fails when missing "as" keyword', () => {
    expect(() => {
      djanjucks.renderString('{% regroup cities by country %}', {
        cities: CITIES
      });
    }).toThrow();
  });

  it('adds target to main context', () => {
    const result = djanjucks.renderString(
      `{% regroup cities by country as country_list %}
<ul>
{% for country in country_list %}
    <li>{{ country.grouper }}
    <ul>
        {% for city in country.list %}
          <li>{{ city.name }}: {{ city.population }}</li>
        {% endfor %}
    </ul>
    </li>
{% endfor %}
</ul>`,
      {
        cities: CITIES
      }
    );
    expect(result).toMatchSnapshot();
  });

  it('allows grouping with dot notation', () => {
    const result = djanjucks.renderString(
      `{% regroup cities by country.color as country_list %}

<ul>
{% for country in country_list %}
    <li>{{ country.grouper }}
    <ul>
        {% for city in country.list %}
          <li>{{ city.country.name }}: {{ city.name }}</li>
        {% endfor %}
    </ul>
    </li>
{% endfor %}
</ul>`,
      {
        cities: CITIES_WITH_OBJECT
      }
    );
    expect(result).toMatchSnapshot();
  });
});
