import path from 'path';
import fs from 'fs';
import postcss from 'postcss';
import flatMap from 'lodash/flatMap';
import flatten from 'lodash/flatten';
import Node from 'postcss/lib/node';
import parseObjectStyles from 'tailwindcss/lib/util/parseObjectStyles';

import {
  toCamelCase,
  capitalizeFirstLetter,
  lowerFirstLetter,
} from '../StringHelpers';
import SelectorParser from '../SelectorParser';

abstract class TypeGenerator {
  private selectorParser: SelectorParser;
  private outDir: string;

  // generate specific properties
  private pluginName?: string;
  private screens?: string[];
  private twSeparator?: string;
  private utilities?: any[];
  private variants?: string[];

  allTypes?: {
    [pluginName: string]: string[][];
  };

  constructor(outDir) {
    this.outDir = outDir;

    // make ourdir of not exits
    if (!fs.existsSync(path.resolve(this.outDir))) {
      fs.mkdirSync(path.resolve(this.outDir));
    }

    this.allTypes = {};
  }

  private parseSelector(selector) {
    this.selectorParser = new SelectorParser(selector);

    return this.selectorParser;
  }

  private parseStyles(styles) {
    if (!Array.isArray(styles)) {
      return this.parseStyles([styles]);
    }

    return flatMap(styles, style =>
      style instanceof Node ? style : parseObjectStyles(style)
    );
  }

  private generateVariantTypes(classNames) {
    let variantTypes = [];
    if (!Array.isArray(this.variants)) {
      return variantTypes;
    }

    this.variants.forEach(variant => {
      if (variant !== 'responsive') {
        variantTypes.push({
          name: capitalizeFirstLetter(
            toCamelCase(variant) + '_' + this.pluginName
          ),
          values: classNames.map(
            className => variant + this.twSeparator + className
          ),
        });

        return;
      }
    });

    return variantTypes;
  }

  private generateResponsiveTypes(types = []) {
    if (!(Array.isArray(this.variants) && this.variants.includes('responsive')))
      return [];

    const breakpoints = Object.keys(this.screens);

    let ResponsiveTypes = types.map(type => {
      let ResponsiveType = {
        name: `Responsive${type.name}`,
        values: {},
      };

      breakpoints.forEach(breakpoint => {
        ResponsiveType.values[breakpoint] = type.values.map(
          value => breakpoint + this.twSeparator + value
        );
      });

      return ResponsiveType;
    });

    return ResponsiveTypes;
  }

  private async writeTypeIntoFile(fileName, content) {
    const file = fileName + '.ts';

    try {
      await fs.promises.writeFile(
        path.normalize(path.resolve(this.outDir, file)),
        content
      );
    } catch (error) {
      console.log(error);
    }
  }

  generate(
    pluginName?: string,
    screens?: string[],
    twSeparator?: string,
    utilities?: any[],
    variants?: string[]
  ): string[] {
    this.pluginName = pluginName;
    this.screens = screens;
    this.twSeparator = twSeparator;
    this.utilities = utilities;
    this.variants = variants;

    const styles = postcss.root({ nodes: this.parseStyles(this.utilities) });

    var classNames = [];

    styles.walkRules(rule => {
      let ruleClasses = this.parseSelector(rule.selector).toClassNames();
      if (ruleClasses.length === 0) {
        return;
      }
      classNames.push(ruleClasses[0].className);
    });

    let mainType = {
      name: capitalizeFirstLetter(this.pluginName),
      values: classNames,
    };
    const variantTypes = this.generateVariantTypes(classNames);

    const types = [mainType, ...variantTypes];

    const responsiveTypes = this.generateResponsiveTypes(types);

    const allPluginTypes = [...types, ...responsiveTypes];

    this.allTypes[pluginName] = allPluginTypes.map(type => type.name);

    this.writeTypeIntoFile(
      capitalizeFirstLetter(this.pluginName),
      allPluginTypes.map(this.createTypeTemplate.bind(this)).join('\n\n')
    );

    return allPluginTypes.map(type => type.name);
  }

  generateTailwindPropsInterface() {
    let importTemplates = Object.keys(this.allTypes)
      .map(
        key =>
          `import { ${this.allTypes[key].join(' , ')} } from './${
            this.allTypes[key][0]
          }';`
      )
      .join('\n');

    let properties = flatten(
      Object.keys(this.allTypes).map(key => {
        return this.allTypes[key].map(
          type => `  tw_${lowerFirstLetter(type)} ?: ${type};`
        );
      })
    ).join('\n');

    let typeTemplate = `export default interface TailwindStyledSystem {
    ${properties}
  }`;

    this.writeTypeIntoFile(
      'TailwindStyledSystem',
      [importTemplates, typeTemplate].join('\n\n')
    );
  }

  abstract createTypeTemplate(type);
}

export default TypeGenerator;
