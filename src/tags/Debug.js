import Tag from './Tag';

class DebugTag extends Tag {
  constructor() {
    super();
    this.tags = ['debug'];
  }

  run(context) {
    return JSON.stringify(context.ctx, null, 2);
  }
}

export default DebugTag;
