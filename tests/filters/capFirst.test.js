import djanjucks from '../../src';
import { runtime } from '../../src';

describe('capfirst filter', () => {
  it('capitalizes the first character only', () => {
    const result = djanjucks.renderString('{{ value|capfirst }}', {
      value: 'a quick test'
    });
    expect(result).toEqual('A quick test');
  });

  it('maintains other capital letters', () => {
    const result = djanjucks.renderString('{{ value|capfirst }}', {
      value: 'a Quick Test'
    });
    expect(result).toEqual('A Quick Test');
  });

  it('preverse escape global', () => {
    const result = djanjucks.renderString('{{ a|capfirst }} {{ b|capfirst }}', {
      a: 'fred>',
      b: runtime.markSafe('fred>')
    });
    expect(result).toEqual('Fred&gt; Fred>');
  });

  it('returns an empty string if value is blank', () => {
    const result = djanjucks.renderString('{{ a|capfirst }}', {
      a: ''
    });
    expect(result).toEqual('');
  });
});
