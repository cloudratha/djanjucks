import nodes from 'nunjucks/src/nodes';

const djanjucksNodes = {
  ...nodes,
  For: nodes.Node.extend('For', {
    fields: ['arr', 'name', 'body', 'empty', 'reversed']
  }),
  IfChanged: nodes.Node.extend('IfChanged', {
    fields: ['body', 'args', 'else']
  }),
  Cycle: nodes.Node.extend('Cycle', {
    fields: ['args', 'target', 'silent']
  }),
  ResetCycle: nodes.Node.extend('ResetCycle', {
    fields: ['arg']
  }),
  With: nodes.Node.extend('With', {
    fields: ['body', 'args', 'target']
  }),
  SafeLiteral: nodes.Value.extend('SafeLiteral')
};

export default djanjucksNodes;
