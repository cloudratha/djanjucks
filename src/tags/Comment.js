import { runtime } from '..';

class CommentTag {
  constructor() {
    this.tags = ['comment'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const title = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    const body = parser.parseUntilBlocks('endcomment');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', title, [body]);
  }

  run(context, ...args) {
    const body = args.pop();
    const title = args.pop();

    return new runtime.SafeString(
      `<!-- ${title ? title + '\n' : ''}${context.env.renderString(
        body(),
        context
      )} -->`
    );
  }
}

export default CommentTag;
