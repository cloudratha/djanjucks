import lexer from 'nunjucks/src/lexer';
import { Parser } from 'nunjucks/src/parser';
import nodes from './nodes';

class DjangoParser extends Parser {
  // Nunjucks wants kwargs in tags to be comma separated.
  // However this is not required in django.
  // This parserSignature bypasses that requirement
  parseSignature(tolerant, noParens) {
    let tok = this.peekToken();
    if (!noParens && tok.type !== lexer.TOKEN_LEFT_PAREN) {
      if (tolerant) {
        return null;
      } else {
        this.fail('expected arguments', tok.lineno, tok.colno);
      }
    }

    if (tok.type === lexer.TOKEN_LEFT_PAREN) {
      tok = this.nextToken();
    }

    const args = new nodes.NodeList(tok.lineno, tok.colno);
    const kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);

    while (1) {
      // eslint-disable-line no-constant-condition
      tok = this.peekToken();
      if (!noParens && tok.type === lexer.TOKEN_RIGHT_PAREN) {
        this.nextToken();
        break;
      } else if (noParens && tok.type === lexer.TOKEN_BLOCK_END) {
        break;
      }

      const arg = this.parseExpression();
      if (this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
        kwargs.addChild(
          new nodes.Pair(arg.lineno, arg.colno, arg, this.parseExpression())
        );
      } else {
        args.addChild(arg);
      }
    }

    if (kwargs.children.length) {
      args.addChild(kwargs);
    }

    return args;
  }

  // A variation of parseSignature that expects a single argument
  parseFilterSignature() {
    let tok = this.peekToken();

    if (tok.type === lexer.TOKEN_COLON) {
      tok = this.nextToken();
    }

    tok = this.peekToken();

    const args = new nodes.NodeList(tok.lineno, tok.colno);
    const arg = this.parsePrimary();
    args.addChild(arg);

    return args;
  }

  // Django Filters take a single argument
  parseFilter(node) {
    while (this.skip(lexer.TOKEN_PIPE)) {
      const name = this.parseFilterName();
      node = new nodes.Filter(
        name.lineno,
        name.colno,
        name,
        new nodes.NodeList(
          name.lineno,
          name.colno,
          [node].concat(this.parseFilterArgs(node))
        )
      );
    }

    return node;
  }

  parseFilterPostfix(node) {
    let tok = this.peekToken();

    if (tok.type === lexer.TOKEN_COLON) {
      // Function call
      node = new nodes.FunCall(
        tok.lineno,
        tok.colno,
        node,
        this.parseFilterSignature()
      );
    }

    return node;
  }

  parseFilterArgs(node) {
    if (this.peekToken().type === lexer.TOKEN_COLON) {
      // Get a FunCall node and add the parameters to the
      // filter
      const call = this.parseFilterPostfix(node);
      return call.args.children;
    }
    return [];
  }

  parseFor() {
    // Taken verbatim from Nunjucks.
    // Add support for empty & reversed.

    var forTok = this.peekToken();
    var node;
    var endBlock;

    if (this.skipSymbol('for')) {
      node = new nodes.For(forTok.lineno, forTok.colno);
      endBlock = 'endfor';
    } else if (this.skipSymbol('asyncEach')) {
      node = new nodes.AsyncEach(forTok.lineno, forTok.colno);
      endBlock = 'endeach';
    } else if (this.skipSymbol('asyncAll')) {
      node = new nodes.AsyncAll(forTok.lineno, forTok.colno);
      endBlock = 'endall';
    } else {
      this.fail('parseFor: expected for{Async}', forTok.lineno, forTok.colno);
    }

    node.name = this.parsePrimary();

    if (!(node.name instanceof nodes.Symbol)) {
      this.fail('parseFor: variable name expected for loop');
    }

    const type = this.peekToken().type;
    if (type === lexer.TOKEN_COMMA) {
      // key/value iteration
      const key = node.name;
      node.name = new nodes.Array(key.lineno, key.colno);
      node.name.addChild(key);

      while (this.skip(lexer.TOKEN_COMMA)) {
        const prim = this.parsePrimary();
        node.name.addChild(prim);
      }
    }

    if (!this.skipSymbol('in')) {
      this.fail(
        'parseFor: expected "in" keyword for loop',
        forTok.lineno,
        forTok.colno
      );
    }

    node.arr = this.parseExpression();

    node.reversed = this.skipSymbol('reversed');

    this.advanceAfterBlockEnd(forTok.value);

    node.body = this.parseUntilBlocks(endBlock, 'empty');

    if (this.skipSymbol('empty')) {
      this.advanceAfterBlockEnd('empty');
      node.empty = this.parseUntilBlocks(endBlock);
    }

    this.advanceAfterBlockEnd();

    return node;
  }

  parseStatement() {
    var tok = this.peekToken();
    var node;

    if (tok.type !== lexer.TOKEN_SYMBOL) {
      this.fail('tag name expected', tok.lineno, tok.colno);
    }

    if (this.breakOnBlocks && this.breakOnBlocks.indexOf(tok.value) !== -1) {
      return null;
    }

    switch (tok.value) {
      case 'raw':
        return this.parseRaw();
      case 'verbatim':
        return this.parseRaw('verbatim');
      case 'if':
      case 'ifAsync':
        return this.parseIf();
      case 'for':
      case 'asyncEach':
      case 'asyncAll':
        return this.parseFor();
      case 'block':
        return this.parseBlock();
      case 'extends':
        return this.parseExtends();
      case 'include':
        return this.parseInclude();
      case 'set':
        return this.parseSet();
      case 'macro':
        return this.parseMacro();
      case 'call':
        return this.parseCall();
      case 'import':
        return this.parseImport();
      case 'from':
        return this.parseFrom();
      case 'filter':
        return this.parseFilterStatement();
      case 'switch':
        return this.parseSwitch();
      default:
        if (this.extensions.length) {
          for (let i = 0; i < this.extensions.length; i++) {
            const ext = this.extensions[i];
            const tags = ext.tags || [];
            if (tags.indexOf(tok.value) !== -1) {
              return ext.parse(this, nodes, lexer);
            }
          }
        }
        this.fail('unknown block tag: ' + tok.value, tok.lineno, tok.colno);
    }

    return node;
  }
}

export default {
  parse(src, extensions, opts) {
    var p = new DjangoParser(lexer.lex(src, opts));
    if (extensions !== undefined) {
      p.extensions = extensions;
    }
    return p.parseAsRoot();
  },
  Parser: DjangoParser
};
