import selectorParser from 'postcss-selector-parser';

class SelectorParser {
  selector: string;

  constructor(selector) {
    this.selector = selector;
  }

  private createSelectorFromNodes(nodes) {
    if (nodes.length === 0) return null;
    const selector = selectorParser.selector(undefined);
    for (let i = 0; i < nodes.length; i++) {
      selector.append(nodes[i]);
    }
    return String(selector).trim();
  }

  toClassNames() {
    const classNames = [];
    const { nodes: subSelectors } = selectorParser().astSync(this.selector);

    for (let i = 0; i < subSelectors.length; i++) {
      let scope = [];
      for (let j = 0; j < subSelectors[i].nodes.length; j++) {
        let node = subSelectors[i].nodes[j];
        let pseudo = [];

        if (node.type === 'class') {
          let next = subSelectors[i].nodes[j + 1];

          while (next && next.type === 'pseudo') {
            pseudo.push(next);
            j++;
            next = subSelectors[i].nodes[j + 1];
          }

          classNames.push({
            className: node.value.trim(),
            scope: this.createSelectorFromNodes(scope),
            __rule: j === subSelectors[i].nodes.length - 1,
            __pseudo: pseudo.map(String),
          });
        }
        scope.push(node, ...pseudo);
      }
    }

    return classNames;
  }
}

export default SelectorParser;
