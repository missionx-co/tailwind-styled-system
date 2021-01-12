import TypeGenerator from './TypeGenerator';

class TypeScriptTypeGenerator extends TypeGenerator {
  private generateValueStrings(values) {
    if (Array.isArray(values)) {
      return values.map(value => `"${value}"`).join(' | ');
    }

    // if is object
    return [
      '{',
      Object.keys(values).map(key => {
        const valuesString = this.generateValueStrings(values[key]);
        return `${key}: ${valuesString}`;
      }),
      '}',
    ].join('\n\n');
  }

  createTypeTemplate(type) {
    let valuesString = '';

    if (Array.isArray(type.values)) {
      valuesString = type.values.map(value => `"${value}"`).join(' | ');
    } else {
      valuesString = [
        '{',
        ...Object.keys(type.values).map(key => {
          const value = type.values[key].map(value => `"${value}"`).join(' | ');
          return `  '${key}': ${value}`;
        }),
        '}',
      ].join('\n');
    }

    return `export type ${type.name} = ${valuesString};`;
  }
}

export default TypeScriptTypeGenerator;
