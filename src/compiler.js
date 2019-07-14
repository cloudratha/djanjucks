import { Compiler } from 'nunjucks/src/compiler';
import transformer from 'nunjucks/src/transformer';
import parser from './parser';
import nodes from './nodes';
import { runtime } from '.';

class DjanjucksCompiler extends Compiler {
  // Prepares an NodeList for wrapping function arguments.
  _compileAggregate(node, frame, startChar, endChar) {
    if (startChar) {
      this._emit(startChar);
    }

    node.children.forEach((child, i) => {
      if (i > 0) {
        this._emit(',');
      }

      // If a child is a Literal, mark it as safe
      if (child instanceof nodes.Literal) {
        child = new nodes.SafeLiteral(child.lineno, child.colno, child.value);
      }

      this.compile(child, frame);
    });

    if (endChar) {
      this._emit(endChar);
    }
  }

  compileSafeLiteral(node, frame) {
    if (typeof node.value === 'string') {
      let val = node.value.toString();
      val = val.replace(/\\/g, '\\\\');
      val = val.replace(/"/g, '\\"');
      val = val.replace(/\n/g, '\\n');
      val = val.replace(/\r/g, '\\r');
      val = val.replace(/\t/g, '\\t');
      val = val.replace(/\u2028/g, '\\u2028');
      this._emit(`runtime.markSafe("${val}")`);
    } else if (node.value === null) {
      this._emit('null');
    } else {
      this._emit(node.value.toString());
    }
  }

  compileWith(node, frame) {
    frame = frame.push();
    this._emitLine('frame = frame.push();');

    if (node.args) {
      node.args.children.forEach(child => {
        var tid = this._tmpid();
        this._emit(`var ${tid} =`);
        this._compileExpression(child, frame);
        this._emit(`;`);

        if (child instanceof nodes.LookupVal) {
          this._emitLine(`frame.set("${node.target.value}", ${tid})`);
          frame.set(node.target.value, tid);
        }
        if (child instanceof nodes.KeywordArgs) {
          child.children.forEach(pair => {
            this._emitLine(
              `frame.set("${pair.key.value}", ${tid}.${pair.key.value})`
            );
            frame.set(pair.key.value, `${tid}.${pair.key.value}`);
          });
        }
      });
    }

    this._withScopedSyntax(() => {
      this.compile(node.body, frame);
    });

    this._emitLine('frame = frame.pop();');
  }

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

  compileCycle(node, frame) {
    const id = this._tmpid();
    this._emitLine(`var ${id};`);

    const args = node.args.children;
    // If no args
    if (args.length < 1) {
      this.fail('cycle: Requires at least one argument.');
    }

    // If a single arg which is a symbol
    if (args.length === 1 && args[0] instanceof nodes.Symbol) {
      const lookup = this._tmpid();
      // Lookup is either a named cycler or lookup value
      this._emit(`var ${lookup} = `);
      this._compileExpression(args[0], frame);
      this._emit(`;`);

      // If we can't lookup the name
      this._emitLine(`if (!${lookup}) {`);
      this._emitLine(
        `throw new Error('cycle: No named cycles in template. "${
          args[0].value
        }" is not defined.');`
      );
      this._emitLine(`}`);

      // Check if the lookup is a cycler or create one
      this._emitLine(
        `if (typeof ${lookup} !== 'object' && typeof ${lookup}.next !== 'function') {`
      );
      this._emitLine(`${id} = env.globals.cycler(${lookup})`);
      this._emit(`} else {`);
      this._emitLine(`${id} = ${lookup}`);
      this._emit(`}`);
    } else {
      this._emitLine(`if (!${id}) {`);
      this._emitLine(`${id} = env.globals.cycler(`);
      node.args.children.forEach(arg => {
        this._compileExpression(arg, frame);
        this._emitLine(`,`);
      });
      this._emitLine(`);`);
      this._emitLine(`${id}.silence(${node.silent})`);
      this._emitLine(`}`);
    }
    this._emitLine(`${id}.next()`);

    this._emitLine(`if (!${id}.silent) {`);
    this._emitLine(
      `${
        this.buffer
      } += runtime.suppressValue(${id}.current, env.opts.autoescape)`
    );
    this._emitLine(`}`);

    // If there is a target set it to the frame or context
    if (node.target) {
      frame.set(node.target.value, id);
      this._emitLine(`frame.set('${node.target.value}', ${id});`);
    } else {
      this._emitLine(`frame.set('${id}', ${id});`);
    }
    this._emitLine(`context.setVariable('_last_cycle', ${id});`);
  }

  compileResetCycle(node, frame) {
    const id = this._tmpid();
    const args = node.args.children;

    // If no args reset last set
    if (args.length < 1) {
      this._emitLine(
        `var ${id} = runtime.contextOrFrameLookup(context, frame, '_last_cycle');`
      );
      this._emitLine(`if (!${id}) {`);
      this._emitLine(
        `throw new Error('resetcycle: No named cycle in template.');`
      );
      this._emitLine(`}`);
    } else {
      this._emit(`var ${id} = `);
      this._compileExpression(args[0], frame);
      this._emit(`;`);

      this._emitLine(`if (!${id}) {`);
      this._emitLine(
        `throw new Error('resetcycle: No named cycle in template called "${
          args[0].value
        }".');`
      );
      this._emitLine(`}`);
    }

    this._emitLine(`${id}.reset();`);
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

  compileFor(node, frame) {
    // Taken verbatim from Nunjucks.
    // Add support for empty & reversed.

    const i = this._tmpid();
    const len = this._tmpid();
    const arr = this._tmpid();
    frame = frame.push();

    this._emitLine('frame = frame.push();');

    this._emit(`var ${arr} = `);
    this._compileExpression(node.arr, frame);
    this._emitLine(';');

    if (node.reversed) {
      this._emitLine(`${arr} = ${arr}.reverse();`);
    }

    this._emit(`if(${arr}) {`);
    this._emitLine(arr + ' = runtime.fromIterator(' + arr + ');');

    // If multiple names are passed, we need to bind them
    // appropriately
    if (node.name instanceof nodes.Array) {
      this._emitLine(`var ${i};`);

      // The object could be an arroy or object. Note that the
      // body of the loop is duplicated for each condition, but
      // we are optimizing for speed over size.
      this._emitLine(`if(runtime.isArray(${arr})) {`);
      this._emitLine(`var ${len} = ${arr}.length;`);
      this._emitLine(`for(${i}=0; ${i} < ${arr}.length; ${i}++) {`);

      // Bind each declared var
      node.name.children.forEach((child, u) => {
        var tid = this._tmpid();
        this._emitLine(`var ${tid} = ${arr}[${i}][${u}];`);
        this._emitLine(`frame.set("${child}", ${arr}[${i}][${u}]);`);
        frame.set(node.name.children[u].value, tid);
      });

      this._emitLoopBindings(node, arr, i, len);
      this._withScopedSyntax(() => {
        this.compile(node.body, frame);
      });
      this._emitLine('}');

      this._emitLine('} else {');
      // Iterate over the key/values of an object
      const [key, val] = node.name.children;
      const k = this._tmpid();
      const v = this._tmpid();
      frame.set(key.value, k);
      frame.set(val.value, v);

      this._emitLine(`${i} = -1;`);
      this._emitLine(`var ${len} = runtime.keys(${arr}).length;`);
      this._emitLine(`for(var ${k} in ${arr}) {`);
      this._emitLine(`${i}++;`);
      this._emitLine(`var ${v} = ${arr}[${k}];`);
      this._emitLine(`frame.set("${key.value}", ${k});`);
      this._emitLine(`frame.set("${val.value}", ${v});`);

      this._emitLoopBindings(node, arr, i, len);
      this._withScopedSyntax(() => {
        this.compile(node.body, frame);
      });
      this._emitLine('}');

      this._emitLine('}');
    } else {
      // Generate a typical array iteration
      const v = this._tmpid();
      frame.set(node.name.value, v);

      this._emitLine(`var ${len} = ${arr}.length;`);
      this._emitLine(`for(var ${i}=0; ${i} < ${arr}.length; ${i}++) {`);
      this._emitLine(`var ${v} = ${arr}[${i}];`);
      this._emitLine(`frame.set("${node.name.value}", ${v});`);

      this._emitLoopBindings(node, arr, i, len);

      this._withScopedSyntax(() => {
        this.compile(node.body, frame);
      });

      this._emitLine('}');
    }

    this._emitLine('}');
    if (node.empty) {
      this._emitLine('if (!' + len + ') {');
      this.compile(node.empty, frame);
      this._emitLine('}');
    }

    this._emitLine('frame = frame.pop();');
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
