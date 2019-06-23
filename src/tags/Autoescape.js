import { runtime } from '..';

const STATES = ['on', 'off'];

class AutoescapeTag {
  constructor() {
    this.tags = ['autoescape'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const args = new nodes.NodeList(token.lineno, token.colno);
    const state = parser.parsePrimary();

    if (STATES.includes(state.value)) {
      args.addChild(new nodes.Literal(state.lineno, state.colno, state.value));
    } else {
      args.addChild(state);
    }

    parser.advanceAfterBlockEnd(token.value);

    const body = parser.parseUntilBlocks('endautoescape');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  }

  run(context, state, body) {
    const on = state === 'on';
    const previous = context.env.opts.autoescape;

    context.env.opts.autoescape = on;
    const response = new runtime.SafeString(body());
    context.env.opts.autoescape = previous;

    return response;
  }
}

export default AutoescapeTag;
