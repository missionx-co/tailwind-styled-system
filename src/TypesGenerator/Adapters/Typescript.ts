import TypeGenerator from './TypeGenerator';

class TypeScriptTypeGenerator extends TypeGenerator {
  private generateValueStrings(values) {
    if (Array.isArray(values)) {
      return values.map(value => `"${value}"`).join(' | ');
    }

    // if is object
    return [
      '{',
      ...Object.keys(values).map(key => {
        const valuesString = this.generateValueStrings(values[key]);
        return `  '${key}'?: ${valuesString}`;
      }),
      '}',
    ].join('\n');
  }

  createTypeTemplate(type) {
    let valuesString = this.generateValueStrings(type.values);

    return `export type ${type.name} = ${valuesString};`;
  }
}

export default TypeScriptTypeGenerator;
