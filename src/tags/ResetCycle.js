class ResetCycleTag {
  constructor() {
    this.tags = ['resetcycle'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const node = new nodes.ResetCycle(token.lineno, token.colno);
    node.args = parser.parseSignature(null, true);

    parser.advanceAfterBlockEnd(token.value);

    return node;
  }
}

export default ResetCycleTag;
