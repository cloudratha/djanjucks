import nodes from 'nunjucks/src/nodes';

const djanjucksNodes = {
  ...nodes,
  For: nodes.Node.extend('For', {
    fields: ['arr', 'name', 'body', 'empty', 'reversed']
  }),
  IfChanged: nodes.Node.extend('IfChanged', {
    fields: ['body', 'args', 'else']
  })
};

export default djanjucksNodes;
