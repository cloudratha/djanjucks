import { runtime } from '..';

class SpacelessTag {
  constructor() {
    this.tags = ['spaceless'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    const body = parser.parseUntilBlocks('endspaceless');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  }

  run(context, body) {
    const htmlTagRegex = />\s+</g;

    return new runtime.SafeString(
      body()
        .trim()
        .replace(htmlTagRegex, '><')
    );
  }
}

export default SpacelessTag;
