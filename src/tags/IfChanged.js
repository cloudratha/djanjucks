class IfChangedTag {
  constructor() {
    this.tags = ['ifchanged'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const node = new nodes.IfChanged(token.lineno, token.colno);
    const args = parser.parseSignature(null, true);
    node.args = args;
    parser.advanceAfterBlockEnd(token.value);

    node.body = parser.parseUntilBlocks('endifchanged', 'else');

    if (parser.skipSymbol('else')) {
      parser.advanceAfterBlockEnd('else');
      node.else = parser.parseUntilBlocks('endifchanged');
    }

    parser.advanceAfterBlockEnd();
    return node;
  }
}

export default IfChangedTag;
