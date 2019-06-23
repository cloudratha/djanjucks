import djanjucks, { Environment } from '../../src';

const TEMPLATE_TAGS_MAP = {
  openblock: '{%',
  closeblock: '%}',
  openvariable: '{{',
  closevariable: '}}',
  openbrace: '{',
  closebrace: '}',
  opencomment: '{#',
  closecomment: '#}'
};

const CUSTOM_TEMPLATE_TAGS_MAP = {
  openblock: '&lt;%',
  closeblock: '%&gt;',
  openvariable: '&lt;$',
  closevariable: '$&gt;',
  openbrace: '{',
  closebrace: '}',
  opencomment: '&lt;#',
  closecomment: '#&gt;'
};

describe('templatetag tag', () => {
  let customEnv;

  beforeAll(() => {
    customEnv = new Environment([], {
      autoescape: true,
      tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
      }
    });
  });

  Object.keys(CUSTOM_TEMPLATE_TAGS_MAP).forEach(tag => {
    it(`renders custom template tag ${tag}`, () => {
      const result = customEnv.renderString(`<% templatetag ${tag} %>`);
      expect(result).toEqual(CUSTOM_TEMPLATE_TAGS_MAP[tag]);
    });
  });

  djanjucks.reset();

  Object.keys(TEMPLATE_TAGS_MAP).forEach(tag => {
    it(`renders template tag ${tag}`, () => {
      const result = djanjucks.renderString(`{% templatetag ${tag} %}`);
      expect(result).toEqual(TEMPLATE_TAGS_MAP[tag]);
    });
  });

  it('will parse the arg if it is not known', () => {
    const result = djanjucks.renderString(`{% templatetag tag %}`, {
      tag: 'openblock'
    });
    expect(result).toEqual(TEMPLATE_TAGS_MAP.openblock);
  });

  it('will render an empty string if tag is unknown', () => {
    const result = djanjucks.renderString(`{% templatetag blockclose %}`);
    expect(result).toEqual('');
  });
});
