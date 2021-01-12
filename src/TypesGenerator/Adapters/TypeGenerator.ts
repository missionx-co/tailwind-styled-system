import path from 'path';
import fs from 'fs';
import postcss from 'postcss';
import flatMap from 'lodash/flatMap';
import Node from 'postcss/lib/node';
import parseObjectStyles from 'tailwindcss/lib/util/parseObjectStyles';

import { toCamelCase, capitalizeFirstLetter } from '../StringHelpers';
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

  constructor(outDir) {
    this.outDir = outDir;

    // make ourdir of not exits
    if (!fs.existsSync(path.resolve(this.outDir))) {
      fs.mkdirSync(path.resolve(this.outDir));
    }
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

      const breakpoints = Object.keys(this.screens);

      let ResponsiveType = {
        name: `Responsive${capitalizeFirstLetter(this.pluginName)}`,
        values: {},
      };
      breakpoints.forEach(breakpoint => {
        ResponsiveType.values[breakpoint] = classNames.map(
          className => breakpoint + this.twSeparator + className
        );
      });

      variantTypes.push(ResponsiveType);
    });

    return variantTypes;
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

    let types = [mainType, ...variantTypes];

    this.writeTypeIntoFile(
      capitalizeFirstLetter(this.pluginName),
      types.map(this.createTypeTemplate).join('\n\n')
    );

    return types.map(type => type.name);
  }

  abstract createTypeTemplate(type);
}

export default TypeGenerator;
