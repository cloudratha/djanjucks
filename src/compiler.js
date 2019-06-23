import { Compiler } from 'nunjucks/src/compiler';
import transformer from 'nunjucks/src/transformer';
import parser from './parser';

class DjanjucksCompiler extends Compiler {
  compileIfChanged(node, frame) {
    const id = this._tmpid();
    const tmp = this._tmpid();
    const body = this._tmpid();
    const changed = this._tmpid();

    this._emitLine(`var ${id} = frame.get('${id}');`);
    this._emitLine(`var ${changed} = false;`);
    this._emitLine(`var ${body} = null;`);

    if (node.args.children.length) {
      this._emitLine(`var ${tmp} = [];`);
      // Add lookups for args into temp var for comparison
      node.args.children.forEach(arg => {
        this._emitLine(`${tmp}.push(`);
        this._compileExpression(arg, frame);
        this._emitLine(`)`);
      });
      this._emitLine(`if (${id}) {`);
      this._emitLine(`for (var i = 0; i < ${tmp}.length; i += 1) {`);
      this._emitLine(`if (${tmp}[i] !== ${id}[i]) {`);
      this._emitLine(`${changed} = true; break;`);
      this._emitLine(`}`);
      this._emitLine(`}`);
      this._emitLine(`}`);

      this._emitLine(`if (!${id} || ${changed}) {`);
      this._emitLine(`${body} = `);
      this.compileCapture(node, frame);
      this._emitLine(`}`);
    } else {
      // No args, so compare body
      this._emitLine(`var ${tmp} = `);
      this.compileCapture(node, frame);
      this._emitLine(`if (${id} !== ${tmp}) {`);
      this._emitLine(`${body} = ${tmp}`);
      this._emitLine(`}`);
    }

    this._emitLine(`frame.set('${id}', ${tmp})`);
    this._emitLine(`if (${body}) {`);
    this._emitLine(`${this.buffer} += ${body}`);

    if (node.else) {
      this._emitLine(`} else {`);
      this._compileExpression(node.else, frame);
    }

    this._emitLine(`}`);
  }

  _emitLoopBindings(node, arr, i, len) {
    const bindings = [
      { name: 'index', val: `${i} + 1` },
      { name: 'index0', val: i },
      { name: 'revindex', val: `${len} - ${i}` },
      { name: 'revindex0', val: `${len} - ${i} - 1` },
      { name: 'first', val: `${i} === 0` },
      { name: 'last', val: `${i} === ${len} - 1` },
      { name: 'length', val: len }
    ];

    bindings.forEach(b => {
      this._emitLine(`frame.set("forloop.${b.name}", ${b.val});`);
    });
  }
}

export default {
  compile: function compile(src, asyncFilters, extensions, name, opts = {}) {
    const c = new DjanjucksCompiler(name, opts.throwOnUndefined);

    // Run the extension preprocessors against the source.
    const preprocessors = (extensions || [])
      .map(ext => ext.preprocess)
      .filter(f => !!f);

    const processedSrc = preprocessors.reduce(
      (s, processor) => processor(s),
      src
    );

    c.compile(
      transformer.transform(
        parser.parse(processedSrc, extensions, opts),
        asyncFilters,
        name
      )
    );
    return c.getCode();
  },
  Compiler: DjanjucksCompiler
};
