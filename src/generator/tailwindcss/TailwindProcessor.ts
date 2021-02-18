import selectorParser from 'postcss-selector-parser';
import Node from 'postcss/lib/node';
import parseObjectStyles from 'tailwindcss/lib/util/parseObjectStyles';
import flatMap from 'lodash/flatMap';
import postcss from 'postcss';

class TailwindProcessor {
  private createSelectorFromNodes(nodes) {
    if (nodes.length === 0) return null;
    const selector = selectorParser.selector(undefined);
    for (let i = 0; i < nodes.length; i++) {
      selector.append(nodes[i]);
    }
    return String(selector).trim();
  }

  private selectortoClassNames(selector: string) {
    const classNames = [];
    const { nodes: subSelectors } = selectorParser().astSync(selector);

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

  private getParsedStyles(styles) {
    return postcss.root({
      nodes: this.parseStyles(styles),
    });
  }

  private parseStyles(styles) {
    if (!Array.isArray(styles)) {
      return this.parseStyles([styles]);
    }

    return flatMap(styles, style =>
      style instanceof Node ? style : parseObjectStyles(style)
    );
  }

  getClassNames(styles) {
    let parsedStyles = this.getParsedStyles(styles);
    let classNames = [];
    parsedStyles.walkRules(rule => {
      let ruleClasses = this.selectortoClassNames(rule.selector);
      if (ruleClasses.length === 0) {
        return;
      }
      classNames.push(ruleClasses[0].className);
    });
    return classNames;
  }
}

export default TailwindProcessor;
