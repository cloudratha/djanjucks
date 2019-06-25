import djanjucks, { lib } from '../../src';

describe('json_script filter', () => {
  it('creates the script tag', () => {
    const result = djanjucks.renderString('{{ value|json_script:"test_id" }}', {
      value: { a: 'testing\r\njson \'string" <b>escaping</b>' }
    });
    expect(result).toEqual(
      `<script id="test_id" type="application/json">{
  "a": "testing\\r\\njson \'string\\" \\u003Cb\\u003Eescaping\\u003C/b\\u003E"
}</script>`
    );
  });

  it('fails when no arg is supplied', () => {
    expect(() => {
      djanjucks.renderString('{{ value|json_script }}', {
        value: { a: 'testing\r\njson \'string" <b>escaping</b>' }
      });
    }).toThrow('json_script filter: missing or blank name argument');
  });
});
