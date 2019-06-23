import djanjucks from '../../src';
import { runtime } from '../../src';

describe('addslashes filter', () => {
  it('adds slashes to safestrings', () => {
    const result = djanjucks.renderString(
      '{{ a|addslashes }} {{ b|addslashes }}',
      {
        a: "<a>'",
        b: runtime.markSafe("<a>'")
      }
    );
    expect(result).toEqual("&lt;a&gt;&#39; <a>\\'");
  });

  it('returns an empty string if value is null/undefined', () => {
    const result = djanjucks.renderString('{{ a|addslashes }}', {
      a: null
    });
    expect(result).toEqual('');
  });
});
