import nunjucks, { runtime, Template, lib } from 'nunjucks';
import Environment from './environment';
import compiler from './compiler';
import parser from './parser';
import { precompile, precompileString } from './precompile';

// Override nunjucks parser and compiler factories
nunjucks.parser.parse = parser.parse;
nunjucks.compiler.compile = compiler.compile;

// Mimic Nunjucks Api
let e;

const configure = (templatesPath, opts = {}) => {
  if (typeof templatesPath === 'object') {
    opts = templatesPath;
    templatesPath = null;
  }

  let TemplateLoader;
  if (nunjucks.FileSystemLoader) {
    TemplateLoader = new nunjucks.FileSystemLoader(templatesPath, {
      watch: opts.watch,
      noCache: opts.noCache
    });
  } else if (nunjucks.WebLoader) {
    TemplateLoader = new nunjucks.WebLoader(templatesPath, {
      useCache: opts.web && opts.web.useCache,
      async: opts.web && opts.web.async
    });
  }

  e = new Environment(TemplateLoader, opts);

  if (opts && opts.express) {
    e.express(opts.express);
  }

  return e;
};

const compile = (src, env, path, eagerCompile) => {
  if (!e) {
    configure();
  }
  return new nunjucks.Template(src, env, path, eagerCompile);
};

const render = (name, ctx, cb) => {
  if (!e) {
    configure();
  }

  return e.render(name, ctx, cb);
};

const renderString = (src, ctx, cb) => {
  if (!e) {
    configure();
  }

  return e.renderString(src, ctx, cb);
};

const reset = () => {
  e = undefined;
};

export { lib, runtime, Environment, Template };

export default {
  precompile,
  precompileString,
  configure,
  compile,
  render,
  renderString,
  reset
};
