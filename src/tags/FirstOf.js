import Tag from './Tag';

class FirstOfTag extends Tag {
  constructor() {
    super();
    this.tags = ['firstof'];
  }

  run(context) {
    // Check the arguments for a truthy value
    for (let i = 1; i < arguments.length; i += 1) {
      if (arguments[i]) {
        return arguments[i];
      }
    }

    return '';
  }
}

export default FirstOfTag;
