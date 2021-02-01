import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import TailwindProcessor from '../tailwindcss/TailwindProcessor';
import fromPairs from 'lodash/fromPairs';

abstract class TypeGenerator {
  // generate specific properties
  protected pluginName?: string;
  private screens?: string[];
  private twSeparator?: string;
  private utilities?: any[];
  private variants?: string[];

  // tailwind stuff
  protected twProcessor: TailwindProcessor;

  allTypes?: {
    [pluginName: string]: any;
  };

  constructor() {
    this.twProcessor = new TailwindProcessor();

    this.allTypes = {};
  }

  private generateVariantTypes(classNames) {
    let variantTypes = {};
    if (!Array.isArray(this.variants)) {
      return variantTypes;
    }

    this.variants.forEach(variant => {
      if (variant !== 'responsive') {
        variantTypes[variant] = {
          [this.pluginName]: classNames.map(
            className => variant + this.twSeparator + className
          ),
        };
      }
    });

    return variantTypes;
  }

  private generateResponsiveTypes(types = {}) {
    if (!(Array.isArray(this.variants) && this.variants.includes('responsive')))
      return {};

    const breakpoints = Object.keys(this.screens);

    let responsiveTypes = { responsive: {} };

    breakpoints.forEach(breakpoint => {
      responsiveTypes.responsive[breakpoint] = mergeWith(
        {},
        types,
        (_des, src) => {
          if (Array.isArray(src)) {
            return src.map(val => breakpoint + this.twSeparator + val);
          }
          return undefined;
        }
      );
    });

    return responsiveTypes;
  }

  private generateAllTypes(classNames) {
    const mainType = {
      [this.pluginName]: classNames,
    };

    const variantTypes = this.generateVariantTypes(classNames);

    const types = merge(mainType, variantTypes);

    const responsiveTypes = this.generateResponsiveTypes(types);

    return merge(types, responsiveTypes);
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

    const classNames = this.twProcessor.getClassNames(this.utilities);

    const allPluginTypes = this.generateAllTypes(classNames);

    this.allTypes = merge(this.allTypes, allPluginTypes);

    return allPluginTypes;
  }

  protected sortTypes() {
    const keys = Object.keys(this.allTypes.responsive || {});

    const sortTwoTypes = (a, b) => {
      const valA = a[1];

      const valB = b[1];

      if (Array.isArray(valA) && !Array.isArray(valB)) {
        return -1;
      } else if (Array.isArray(valA) && Array.isArray(valB)) {
        return 0;
      } else {
        return 1;
      }
    };

    for (let index = 0; index < keys.length; index++) {
      const breakpoint = keys[index];
      this.allTypes.responsive[breakpoint] = fromPairs(
        Object.entries(this.allTypes.responsive[breakpoint]).sort(sortTwoTypes)
      );
    }

    this.allTypes = fromPairs(Object.entries(this.allTypes).sort(sortTwoTypes));
  }
}

export default TypeGenerator;
