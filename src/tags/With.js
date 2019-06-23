import { runtime } from '..';

// https://github.com/allmarkedup/nunjucks-with
class With {
  constructor() {
    this.tags = ['with'];
  }

  parse(parser, nodes, lexer) {
    const start = parser.tokens.index;
    const token = parser.nextToken();
    const args = parser.parseSignature(null, true);
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

  run(context, args, body) {
    const output = context.env.renderString(body(), {
      ...context.ctx,
      ...args
    });
    return output;
  }
}

export default With;
