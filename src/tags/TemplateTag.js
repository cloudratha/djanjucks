const TEMPLATE_TAGS = {
  openblock: 'BLOCK_START',
  closeblock: 'BLOCK_END',
  openvariable: 'VARIABLE_START',
  closevariable: 'VARIABLE_END',
  openbrace: 'BRACE_START',
  closebrace: 'BRACE_END',
  opencomment: 'COMMENT_START',
  closecomment: 'COMMENT_END'
};

class TemplateTag {
  constructor() {
    this.tags = ['templatetag'];
    this.envTags = {};
  }

  parse(parser, nodes) {
    this.envTags = {
      BRACE_START: '{',
      BRACE_END: '}',
      ...parser.tokens.tags
    };
    const token = parser.nextToken();
    const args = new nodes.NodeList(token.lineno, token.colno);
    const tagName = parser.parsePrimary();

    if (Object.keys(TEMPLATE_TAGS).includes(tagName.value)) {
      args.addChild(
        new nodes.Literal(tagName.lineno, tagName.colno, tagName.value)
      );
    } else {
      args.addChild(tagName);
    }

    parser.advanceAfterBlockEnd(token.value);

    return new nodes.CallExtension(this, 'run', args);
  }

  run(context, templateTag) {
    const key = TEMPLATE_TAGS[templateTag];
    if (key && Object.keys(this.envTags).includes(key)) {
      return this.envTags[TEMPLATE_TAGS[templateTag]];
    }

    return '';
  }
}

export default TemplateTag;
