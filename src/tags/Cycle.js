class CycleTag {
  constructor() {
    this.tags = ['cycle'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const node = new nodes.Cycle(token.lineno, token.colno);
    const args = parser.parseSignature(null, true);
    node.silent = false;

    // Check to see if there is a target
    const targetIndex = args.children.findIndex(arg => arg.value === 'as');

    // If we have the "as" arg we should expect a named target
    if (targetIndex !== -1) {
      // ["as", "target", "silent"]
      const target = args.children.splice(
        targetIndex,
        args.children.length - targetIndex
      );

      if (target.length === 1) {
        parser.fail(`cycle: Expected cycle name after keyword "as".`);
      }
      // We can assume that we have a target
      node.target = target[1];

      // Check if we have more than 1 flag
      if (target.length > 3) {
        parser.fail(
          `cycle: Only a single "silent" flag is allowed, not "[${target
            .slice(2)
            .map(x => x.value)
            .join(', ')}]".`
        );
      } else if (target.length === 3) {
        if (target[2].value !== 'silent') {
          parser.fail(
            `cycle: Only "silent" flag is allowed after cycle name, not "${
              target[2].value
            }".`
          );
        } else {
          node.silent = true;
        }
      }
    }

    node.args = args;
    parser.advanceAfterBlockEnd(token.value);

    return node;
  }
}

export default CycleTag;
