import djanjucks, { runtime } from '../../src';

const FLOAT_FORMATS = {
  '7.7': '7.7',
  '7.0': '7',
  '0.7': '0.7',
  '0.07': '0.1',
  '0.007': '0.0',
  '0.0': '0',
  foo: '',
  '¿Cómo esta usted?': ''
};

const FLOAT_FORMATS_WITH_ARGS = {
  '0': {
    '7.7': '8'
  },
  '2': {
    '5555.555': '5555.56',
    '001.3000': '1.30',
    '18.125': '18.13',
    '-1.323297138040798e+35': '-132329713804079800000000000000000000.00'
  },
  '-2': {
    '11.1197': '11.12',
    '11.0000': '11',
    '11.000001': '11.00',
    '-1.323297138040798e+35': '-132329713804079800000000000000000000'
  },
  '3': {
    '7.7': '7.700',
    '6.000000': '6.000',
    '6.200000': '6.200',
    '8.2798': '8.280'
  },
  '-3': {
    '6.200000': '6.200',
    '13.1031': '13.103'
  },
  '16': {
    '1.00000000000000015': '1.0000000000000002'
  },
  '20': {
    '1.5e-15': '0.00000000000000150000'
  },
  '-20': {
    '1.5e-15': '0.00000000000000150000'
  },
  bar: {
    '13.1031': '13.1031',
    foo: ''
  }
};

describe('floatformat filter', () => {
  it('renders correctly with no args', () => {
    const result = djanjucks.renderString('{{ a|floatformat }}', {
      a: '1.42'
    });
    expect(result).toEqual('1.4');
  });

  it('is unaffected by autoescape', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|floatformat }} {{ b|floatformat }}{% endautoescape %}',
      {
        a: '1.42',
        b: runtime.markSafe('1.42')
      }
    );
    expect(result).toEqual('1.4 1.4');
  });

  Object.keys(FLOAT_FORMATS).forEach(value => {
    it(`transforms "${value}" with no args`, () => {
      const result = djanjucks.renderString('{{ value|floatformat }}', {
        value
      });
      expect(result).toEqual(FLOAT_FORMATS[value]);
    });
  });

  Object.keys(FLOAT_FORMATS_WITH_ARGS).forEach(arg => {
    Object.keys(FLOAT_FORMATS_WITH_ARGS[arg]).forEach(value => {
      it(`transforms "${value}" with "${arg}"`, () => {
        const result = djanjucks.renderString(
          `{{ value|floatformat:"${arg}" }}`,
          {
            value
          }
        );
        expect(result).toEqual(FLOAT_FORMATS_WITH_ARGS[arg][value]);
      });
    });
  });
});
