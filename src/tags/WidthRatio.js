import { isNodeNumber } from '../utilities';

class WidthRatioTag {
  constructor() {
    this.tags = ['widthratio'];
  }

  parse(parser, nodes) {
    const numberOrLookup = node => {
      if (typeof node.value === 'number') {
        return new nodes.Literal(node.lineno, node.colno, node.value);
      }

      return node;
    };

    const token = parser.nextToken();
    const args = new nodes.NodeList(token.lineno, token.colno);
    const value = numberOrLookup(parser.parsePrimary());
    args.addChild(value);
    const max = numberOrLookup(parser.parsePrimary());
    args.addChild(max);
    const width = numberOrLookup(parser.parsePrimary());
    args.addChild(width);

    if (parser.skipSymbol('as')) {
      const variable = parser.nextToken();
      args.addChild(
        new nodes.Literal(variable.lineno, variable.colno, variable.value)
      );
    }

    parser.advanceAfterBlockEnd(token.value);

    return new nodes.CallExtension(this, 'run', args);
  }

  run(context, value, max, width, variable) {
    const getRatio = () => {
      const floatValue = parseFloat(value);
      const floatMax = parseFloat(max);
      const floatWidth = parseFloat(width);

      // Catch division by 0
      if (floatMax === 0) {
        return '0';
      }

      const ratio = (floatValue / floatMax) * floatWidth;

      if (isNaN(ratio)) {
        return '';
      }

      // Mimic python default rounding
      return String(-Math.round(-ratio));
    };

    const output = getRatio();

    if (variable) {
      context.ctx[variable] = output;
      return '';
    }

    return output;
  }
}

export default WidthRatioTag;
