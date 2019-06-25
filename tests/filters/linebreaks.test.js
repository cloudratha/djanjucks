import djanjucks, { runtime } from '../../src';

describe('linebreaks filter', () => {
  it('preserves autoescape', () => {
    const result = djanjucks.renderString(
      '{{ a|linebreaks }} {{ b|linebreaks }}',
      {
        a: 'x&\ny',
        b: runtime.markSafe('x&\ny')
      }
    );
    expect(result).toEqual(`<p>x&amp;<br>y</p> <p>x&<br>y</p>`);
  });

  it('preserves autoescape with global off', () => {
    const result = djanjucks.renderString(
      '{% autoescape off %}{{ a|linebreaks }} {{ b|linebreaks }}{% endautoescape %}',
      {
        a: 'x&\ny',
        b: runtime.markSafe('x&\ny')
      }
    );
    expect(result).toEqual(`<p>x&<br>y</p> <p>x&<br>y</p>`);
  });

  it('wraps a single line', () => {
    const result = djanjucks.renderString('{{ value|linebreaks }}', {
      value: 'line 1'
    });
    expect(result).toEqual(`<p>line 1</p>`);
  });

  it('replaces a single newline with a br', () => {
    const result = djanjucks.renderString('{{ value|linebreaks }}', {
      value: 'line 1\nline 2'
    });
    expect(result).toEqual(`<p>line 1<br>line 2</p>`);
  });

  it('replaces a return with a br', () => {
    const result = djanjucks.renderString('{{ value|linebreaks }}', {
      value: 'line 1\rline 2'
    });

    console.log(result);
    expect(result).toEqual(`<p>line 1<br>line 2</p>`);
  });

  it('replaces a return newline with a br', () => {
    const result = djanjucks.renderString('{{ value|linebreaks }}', {
      value: 'line 1\r\nline 2'
    });
    console.log(result);

    expect(result).toEqual(`<p>line 1<br>line 2</p>`);
  });
});
