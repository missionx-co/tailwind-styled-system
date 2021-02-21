import path from 'path';
import fs from 'fs';
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

  private generateValueStrings(key, values) {
    if (Array.isArray(values)) {
      if (
        [
          'padding',
          'margin',
          'borderRadius',
          'borderWidth',
          'overflow',
          'overscrollBehavior',
          'inset',
          'gap',
          'divideWidth',
          'scale',
          'translate',
          'skew',
        ].includes(key)
      ) {
        return `(${values.map(value => `"${value}"`).join(' | ')})[]`;
      }
      return values.map(value => `"${value}"`).join(' | ');
    }

    // if is object
    return [
      '{',
      ...Object.keys(values).map(key => {
        const valuesString = this.generateValueStrings(key, values[key]);
        return `    ${formatPropName(key)} ?: ${valuesString}`;
      }),
      '}',
    ].join('\n');
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

  generateTailwindPropsInterface() {
    this.sortTypes();

    const allTypesSorted = Object.entries(this.allTypes);
    let properties = allTypesSorted
      .map(([key, value]) => {
        return `  ${formatPropName(key)} ?: ${this.generateValueStrings(
          key,
          value
        )};`;
      })
      .join('\n');

    properties = properties
      .concat('\n')
      .concat(`  customUtilities ?: string[];`);

    let typeTemplate = `export default interface TailwindStylingObject {
    ${properties}
  }`;

    this.writeTypeIntoFile('TailwindStylingObject', typeTemplate);
  }
}

export default TypeTemplatesCreator;
