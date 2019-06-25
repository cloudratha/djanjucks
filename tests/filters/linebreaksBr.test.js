import djanjucks, { runtime } from '../../src';

describe('linebreaksbr filter', () => {
  it('preserves autoescape', () => {
    const result = djanjucks.renderString(
      '{{ a|linebreaksbr }} {{ b|linebreaksbr }}',
      {
        a: 'x&\ny',
        b: runtime.markSafe('x&\ny')
      }
    );
    expect(result).toEqual(`x&amp;<br>y x&<br>y`);
  });

  it('preserves autoescape with global off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|linebreaksbr }} {{ b|linebreaksbr }}{% endautoescape %}',
      {
        a: 'x&\ny',
        b: runtime.markSafe('x&\ny')
      }
    );
    expect(result).toEqual(`x&<br>y x&<br>y`);
  });

  it('replaces a newline', () => {
    const result = djanjucks.renderString('{{ value|linebreaksbr }}', {
      value: 'line 1\nline 2'
    });
    expect(result).toEqual(`line 1<br>line 2`);
  });

  it('safely removes return carriage', () => {
    const result = djanjucks.renderString('{{ value|linebreaksbr }}', {
      value: 'line 1\rline 2'
    });
    expect(result).toEqual(`line 1<br>line 2`);
  });

  it('replaces a return newline with a br', () => {
    const result = djanjucks.renderString('{{ value|linebreaksbr }}', {
      value: 'line 1\r\nline 2'
    });
    expect(result).toEqual(`line 1<br>line 2`);
  });

  it('handles non string values', () => {
    const result = djanjucks.renderString('{{ value|linebreaksbr }}', {
      value: 123
    });
    expect(result).toEqual(`123`);
  });
});
