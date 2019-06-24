import { runtime } from '..';

// https://github.com/allmarkedup/nunjucks-with
class With {
  constructor() {
    this.tags = ['with'];
  }

  parse(parser, nodes, lexer) {
    const start = parser.tokens.index;
    const token = parser.nextToken();
    // const args = parser.parseSignature(null, true);

    const args = new nodes.NodeList(token.lineno, token.colno);
    const kwargs = new nodes.KeywordArgs(token.lineno, token.colno);

    let tok;
    while (1) {
      // eslint-disable-line no-constant-condition
      tok = parser.peekToken();
      if (tok.type === lexer.TOKEN_RIGHT_PAREN) {
        parser.nextToken();
        break;
      } else if (tok.type === lexer.TOKEN_BLOCK_END) {
        break;
      }

      if (parser.skipSymbol('as')) {
        if (!args.children.length) {
          parser.fail('With Tag: Too many arguments supplied for with "as"');
        }

        const alias = parser.parsePrimary();
        kwargs.addChild(
          new nodes.Pair(
            token.lineno,
            token.colno,
            new nodes.Literal(tok.lineno, tok.colno, 'as'),
            new nodes.Literal(alias.lineno, alias.colno, alias.value)
          )
        );
        break;
      }

      const arg = parser.parseExpression();

      if (parser.skipValue(lexer.TOKEN_OPERATOR, '=')) {
        kwargs.addChild(
          new nodes.Pair(arg.lineno, arg.colno, arg, parser.parseExpression())
        );
      } else {
        args.addChild(arg);
      }
    }

    if (kwargs.children.length) {
      args.addChild(kwargs);
    }

    const current = parser.tokens.index;

    // Rewind cursor back to beginning
    parser.tokens.backN(current - start);
    while (parser.tokens.current() !== '{') {
      parser.tokens.back();
    }

    parser.peeked = null;
    // peek up to block end
    var peek;
    while ((peek = parser.peekToken())) {
      if (peek.type === lexer.TOKEN_BLOCK_END) {
        break;
      }
      parser.nextToken();
    }

    parser.tokens.backN(2);
    parser.peeked = token;
    parser.tokens.in_code = true;
    const body = parser.parseRaw('with');
    return new nodes.CallExtension(this, 'run', args, [body]);
  }

  run(context, ...args) {
    let arg = args.shift();
    let ctx = arg;

    if (typeof arg !== 'object') {
      const kwargs = args.shift();
      ctx = {
        [kwargs.as]: arg
      };
    }

    const body = args.shift();
    const output = context.env.renderString(body(), {
      ...context.ctx,
      ...ctx
    });

    return output;
  }
}

export default With;
