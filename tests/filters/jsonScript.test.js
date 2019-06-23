import djanjucks from '../../src';

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
});
