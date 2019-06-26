import djanjucks, { runtime } from '../../src';

const PLURALIZE_TESTS_0 = {
  '0': 'votes',
  '1': 'vote',
  '2': 'votes'
};

const PLURALIZE_TESTS_1 = {
  '0': 'classes',
  '1': 'class',
  '2': 'classes'
};

const PLURALIZE_TESTS_2 = {
  '0': 'candies',
  '1': 'candy',
  '2': 'candies'
};

describe('pluralize filter', () => {
  Object.keys(PLURALIZE_TESTS_0).forEach(value => {
    it('renders correctly with 0 arguments', () => {
      const result = djanjucks.renderString('vote{{ value|pluralize }}', {
        value
      });
      expect(result).toEqual(PLURALIZE_TESTS_0[value]);
    });
  });

  Object.keys(PLURALIZE_TESTS_1).forEach(value => {
    it('renders correctly with 1 argument', () => {
      const result = djanjucks.renderString('class{{ value|pluralize:"es" }}', {
        value
      });
      expect(result).toEqual(PLURALIZE_TESTS_1[value]);
    });
  });

  Object.keys(PLURALIZE_TESTS_2).forEach(value => {
    it('renders correctly with 2 arguments', () => {
      const result = djanjucks.renderString(
        'cand{{ value|pluralize:"y,ies" }}',
        {
          value
        }
      );
      expect(result).toEqual(PLURALIZE_TESTS_2[value]);
    });
  });

  it('returns an empty string if more than 2 args', () => {
    const result = djanjucks.renderString('{{ value|pluralize:"y,es,ies" }}', {
      value: 'test'
    });
    expect(result).toEqual('');
  });

  it('allows float values', () => {
    const result = djanjucks.renderString('{{ value|pluralize }}', {
      value: 0.5
    });
    expect(result).toEqual('s');
  });

  it('allows array values', () => {
    const result = djanjucks.renderString('{{ value|pluralize }}', {
      value: [1]
    });
    expect(result).toEqual('');
  });

  it('allows array values 2', () => {
    const result = djanjucks.renderString('{{ value|pluralize }}', {
      value: []
    });
    expect(result).toEqual('s');
  });

  it('allows array values 3', () => {
    const result = djanjucks.renderString('{{ value|pluralize }}', {
      value: [1, 2, 3]
    });
    expect(result).toEqual('s');
  });

  it('returns singular if non string', () => {
    const result = djanjucks.renderString('{{ value|pluralize }}', {
      value: 'hello'
    });
    expect(result).toEqual('');
  });
});
