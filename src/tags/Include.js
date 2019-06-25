class IncludeTag {
  constructor() {
    this.tags = ['include'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const args = new nodes.NodeList(token.lineno, token.colno);

    const template = parser.parsePrimary();
    args.addChild(template);
    if (parser.skipSymbol('with')) {
      // Cheekily use parseSignature here.
      // Arg should be compared to "only"
      let kwargs = parser.parseSignature(null, true);
      if (kwargs.children[0] && kwargs.children[0].value === 'only') {
        kwargs.children[kwargs.children.length - 1].addChild(
          new nodes.Pair(
            token.lineno,
            token.colno,
            kwargs.children[0],
            new nodes.Literal(
              kwargs.children[0].lineno,
              kwargs.children[0].colno,
              true
            )
          )
        );
      }
      args.addChild(kwargs.children[kwargs.children.length - 1]);
    }

    parser.advanceAfterBlockEnd(token);
    return new nodes.CallExtension(this, 'run', args);
  }

  run(context, template, kwargs) {
    let ctx = {
      only: false,
      ...kwargs
    };

    if (!ctx.only) {
      ctx = {
        ...context.ctx,
        ...ctx
      };
    }

    delete ctx.only;
    const output = context.env.render(template, ctx);

    return output;
  }
}

export default IncludeTag;
