import groupBy from 'lodash.groupby';
import get from 'lodash.get';

import { flattenTokenDotNotation } from '../utilities';

class RegroupTag {
  constructor() {
    this.tags = ['regroup'];
  }

  parse(parser, nodes) {
    const token = parser.nextToken();
    const args = new nodes.NodeList(token.lineno, token.colno);
    args.addChild(parser.parsePrimary());

    if (!parser.skipSymbol('by')) {
      parser.fail(
        'regroupTag: expected "by" keyword for regroup',
        token.lineno,
        token.colno
      );
    }

    // Grouper should always be considered a String Literal
    const grouper = parser.parseExpression();
    const value = flattenTokenDotNotation(grouper);
    args.addChild(new nodes.Literal(grouper.lineno, grouper.colno, value));

    if (!parser.skipSymbol('as')) {
      parser.fail(
        'regroupTag: expected "as" keyword for regroup',
        token.lineno,
        token.colno
      );
    }

    const target = parser.parseExpression();
    args.addChild(new nodes.Literal(target.lineno, target.colno, target.value));

    parser.advanceAfterBlockEnd(token.value);
    return new nodes.CallExtension(this, 'run', args);
  }

  run(context, source, grouper, target) {
    const group = groupBy(source, item => get(item, grouper));
    const grouped = Object.keys(group).map(key => ({
      grouper: key,
      list: group[key]
    }));
    // Not sure if this is the correct way to add to main context, but works
    context.ctx[target] = grouped;
  }
}

export default RegroupTag;
