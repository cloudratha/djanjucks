import Tag from './Tag';

class PageUrlTag extends Tag {
  constructor() {
    super();
    this.tags = ['pageurl'];
  }

  run(context, attr) {
    return attr.url;
  }
}

export default PageUrlTag;
