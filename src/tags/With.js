class With {
  constructor() {
    this.tags = ['with'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const node = new nodes.With(token.lineno, token.colno);

    const args = parser.parseSignature(null, true);
    const targetIndex = args.children.findIndex(arg => arg.value === 'as');
    if (targetIndex !== -1) {
      const target = args.children.splice(
        targetIndex,
        args.children.length - targetIndex
      );

      if (args.children.length !== 1) {
        parser.fail('with: only one argument allowed when using "as".');
      } else if (target.length === 1) {
        parser.fail('with: missing target argument after "as".');
      } else if (target.length > 2) {
        parser.fail('with: too many arguments provided after "as".');
      }

      node.target = target[1];
    }

    node.args = args;
    parser.advanceAfterBlockEnd(token.value);

    node.body = parser.parseUntilBlocks('endwith');
    parser.advanceAfterBlockEnd();

    return node;
  }
}

export default With;
