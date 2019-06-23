class LoadTag {
  constructor() {
    this.tags = ['load'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    parser.parsePrimary();
    parser.advanceAfterBlockEnd(token.value);
    return new nodes.CallExtension(this, 'run');
  }

  run() {
    return '';
  }
}

export default LoadTag;
