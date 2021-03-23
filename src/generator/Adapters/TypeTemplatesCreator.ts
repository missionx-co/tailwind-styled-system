import path from 'path';
import fs from 'fs';
import mergeWith from 'lodash/mergeWith';
import merge from 'lodash/merge';
import { capitalizeFirstLetter } from '../StringHelpers';
import { formatPropName } from '../StringHelpers';
import TypeGenerator from './TypeGenerator';

class TypeTemplatesCreator extends TypeGenerator {
  private outDir: string;

  constructor(outDir) {
    super();
    this.outDir = outDir;
    // make ourdir if not exits
    if (!fs.existsSync(path.resolve(this.outDir))) {
      fs.mkdirSync(path.resolve(this.outDir));
    }
  }

  private convertToArrayType(values) {
    if (typeof values === 'string') {
      return `(${values})[]`;
    }

    // if is object
    return [
      '{',
      ...Object.keys(values).map(key => {
        const valuesString = this.convertToArrayType(values[key]);
        return `    ${formatPropName(key)} ?: ${valuesString}`;
      }),
      '}',
    ].join('\n');
  }

  private formatPropType(prefix, type) {
    const typeStr = prefix + this.twSeparator + '${' + type + '}';
    return '`' + typeStr + '`';
  }

  private generateVariantProps(mainType = '') {
    let variantProps = {};
    if (!Array.isArray(this.variants)) {
      return variantProps;
    }

    this.variants.forEach(variant => {
      variantProps[variant] = {
        [this.pluginName]: this.formatPropType(variant, mainType),
      };
    });

    return variantProps;
  }

  private generateResponsiveProps(props = {}) {
    const breakpoints = Object.keys(this.screens);

    let responsiveTypes = { responsive: {} };

    breakpoints.forEach(breakpoint => {
      responsiveTypes.responsive[breakpoint] = mergeWith(
        {},
        props,
        (_des, src) => {
          if (typeof src === 'string') {
            return this.formatPropType(breakpoint, src);
          }
          return undefined;
        }
      );
    });

    return responsiveTypes;
  }

  private handlePropsOfArrayType(props) {
    // make the props type as array if needed
    if (
      [
        'padding',
        'margin',
        'borderRadius',
        'borderWidth',
        'overflow',
        'space',
        'overscrollBehavior',
        'inset',
        'gap',
        'divideWidth',
        'scale',
        'translate',
        'skew',
      ].includes(this.pluginName)
    ) {
      return mergeWith({}, props, (_des, src) => {
        if (typeof src === 'string') {
          return `(${src})[]`;
        }
        return undefined;
      });
    }

    return props;
  }

  private generateAllProps() {
    const mainType = capitalizeFirstLetter(this.pluginName);

    const mainProp = {
      [this.pluginName]: mainType,
    };

    const props = merge({}, mainProp, this.generateVariantProps(mainType));

    let allProps = merge({}, props, this.generateResponsiveProps(props));

    return this.handlePropsOfArrayType(allProps);
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

    const newType = this.generateType();

    const allPluginProps = this.generateAllProps();

    this.allInterfaceProps = merge({}, this.allInterfaceProps, allPluginProps);

    this.generateTypeFile(newType);

    return allPluginProps;
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

  generateTypeFile(type) {
    const name = Object.keys(type || {})[0];
    const classes =
      (Object.prototype.hasOwnProperty.call(type, name) && type[name]) || [];

    const typeName = capitalizeFirstLetter(name);
    const valuesString = classes.map(value => `"${value}"`).join(' | ');
    let typeTemplate = `type ${typeName} = ${valuesString};\n`;
    typeTemplate = typeTemplate.concat(`export default ${typeName};`);

    this.writeTypeIntoFile(typeName, typeTemplate);
  }
  private formatInterfaceProps(values) {
    if (typeof values === 'string') {
      return values;
    }

    // if object
    return [
      '{',
      ...Object.keys(values).map(key => {
        const valuesString = this.formatInterfaceProps(values[key]);
        return `    ${formatPropName(key)} ?: ${valuesString}`;
      }),
      '}',
    ].join('\n');
  }
  generateTailwindPropsInterface() {
    const imports = Object.entries(this.allTypes)
      .map(
        ([key, value]) =>
          `import ${capitalizeFirstLetter(key)} from './${capitalizeFirstLetter(
            key
          )}';`
      )
      .join('\n');

    this.sortProps();

    const allPropsSorted = Object.entries(this.allInterfaceProps);
    let properties = allPropsSorted
      .map(([key, value]) => {
        return `  ${formatPropName(key)} ?: ${this.formatInterfaceProps(
          value
        )};`;
      })
      .join('\n');

    properties = properties
      .concat('\n')
      .concat(`  customUtilities ?: string[];`);

    const typeTemplate = `${imports}\n\nexport default interface TailwindStylingObject {\n${properties}}`;

    this.writeTypeIntoFile('index', typeTemplate);
  }
}

export default TypeTemplatesCreator;
