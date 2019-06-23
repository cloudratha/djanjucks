import Tag from './Tag';
import { date } from '../filters';

class NowTag extends Tag {
  constructor() {
    super();
    this.tags = ['now'];
  }

  run(context, format) {
    return date(new Date(), format);
  }
}

export default NowTag;
