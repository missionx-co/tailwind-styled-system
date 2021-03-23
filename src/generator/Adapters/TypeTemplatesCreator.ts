import path from 'path';
import fs from 'fs';
import { capitalizeFirstLetter } from '../StringHelpers';
import { formatPropName } from '../StringHelpers';
import TypeGenerator from './TypeGenerator';

class TypeTemplatesCreator extends TypeGenerator {
  private outDir: string;

  constructor(outDir) {
    super();
    this.outDir = outDir + '/TailwindStylingObject';
    // make ourdir if not exits
    if (!fs.existsSync(path.resolve(this.outDir))) {
      fs.mkdirSync(path.resolve(this.outDir));
    }
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

  generate(
    pluginName?: string,
    screens?: string[],
    twSeparator?: string,
    utilities?: any[],
    variants?: string[]
  ) {
    this.pluginName = pluginName;
    this.screens = screens;
    this.twSeparator = twSeparator;
    this.utilities = utilities;

    const newType = this.generateType();

    this.generateTypeFile(newType);

    return newType;
  }

  private formatInterfaceProps(key, values) {
    if (typeof values === 'string') {
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
        ].includes(key)
      ) {
        return `(${values})[]`;
      } else {
        return values;
      }
    }

    // if object
    return [
      '{',
      ...Object.keys(values).map(key => {
        const valuesString = this.formatInterfaceProps(key, values[key]);
        return `    ${formatPropName(key)} ?: ${valuesString}`;
      }),
      '}',
    ].join('\n');
  }

  generateTailwindPropsInterface() {
    this.generateAllProps();

    this.sortProps();

    const imports = Object.entries(this.allTypes)
      .map(
        ([key, value]) =>
          `import ${capitalizeFirstLetter(key)} from './${capitalizeFirstLetter(
            key
          )}';`
      )
      .join('\n');

    const allPropsSorted = Object.entries(this.allInterfaceProps);
    let properties = allPropsSorted
      .map(([key, value]) => {
        return `  ${formatPropName(key)} ?: ${this.formatInterfaceProps(
          key,
          value
        )};`;
      })
      .join('\n');

    properties = properties
      .concat('\n')
      .concat(`  customUtilities ?: string[];`);

    const typeTemplate = `${imports}\n\nexport default interface TailwindStylingObject {\n${properties}\n}`;

    this.writeTypeIntoFile('index', typeTemplate);
  }
}

export default TypeTemplatesCreator;
