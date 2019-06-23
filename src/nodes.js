import nodes from 'nunjucks/src/nodes';

const djanjucksNodes = {
  ...nodes,
  IfChanged: nodes.Node.extend('IfChanged', {
    fields: ['body', 'args', 'else']
  })
};

export default djanjucksNodes;
