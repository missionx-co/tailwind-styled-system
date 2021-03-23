import TailwindProcessor from '../tailwindcss/TailwindProcessor';
import fromPairs from 'lodash/fromPairs';
import mergeWith from 'lodash/mergeWith';
import merge from 'lodash/merge';
import variants from '../tailwindcss/variants';
import { capitalizeFirstLetter } from '../StringHelpers';

abstract class TypeGenerator {
  // generate specific properties
  protected pluginName?: string;
  protected screens?: string[];
  protected twSeparator?: string;
  protected utilities?: any[];
  protected variants?: string[];

  // tailwind stuff
  protected twProcessor: TailwindProcessor;

  allTypes?: {
    [pluginName: string]: any;
  };

  allInterfaceProps?: {
    [name: string]: any;
  };

  constructor() {
    this.twProcessor = new TailwindProcessor();

    this.allTypes = {};
    this.allInterfaceProps = {};
    this.variants = variants;
  }

  protected generateType() {
    const classNames = this.twProcessor.getClassNames(this.utilities);

    const mainType = {
      [this.pluginName]: classNames,
    };
    this.allTypes = merge({}, this.allTypes, mainType);

    return mainType;
  }

  private formatPropType(prefix, type) {
    const typeStr = prefix + this.twSeparator + '${' + type + '}';
    return '`' + typeStr + '`';
  }

  private generateVariantProps(mainProps) {
    let variantProps = {};
    if (!Array.isArray(this.variants)) {
      return variantProps;
    }

    this.variants.forEach(variant => {
      variantProps[variant] = {} as any;
      Object.entries(mainProps || {}).forEach(([key, value]) => {
        variantProps[variant][key] = this.formatPropType(variant, value);
      });
    });

    return variantProps;
  }

  private generateResponsiveProps(props = {}) {
    const breakpoints = Object.keys(this.screens);

    let responsiveProps = { responsive: {} };

    breakpoints.forEach(breakpoint => {
      responsiveProps.responsive[breakpoint] = mergeWith(
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

    return responsiveProps;
  }

  protected generateAllProps() {
    const mainProps: any = {};

    Object.entries(this.allTypes).forEach(([key, value]) => {
      mainProps[key] = capitalizeFirstLetter(key);
    });

    const props = merge({}, mainProps, this.generateVariantProps(mainProps));

    const allProps = merge({}, props, this.generateResponsiveProps(props));

    this.allInterfaceProps = allProps;

    return allProps;
  }

  protected sortProps() {
    const keys = Object.keys(this.allInterfaceProps.responsive || {});

    const sortTwoProps = (a, b) => {
      const valA = a[1];

      const valB = b[1];

      if (typeof valA === 'string' && !(typeof valB === 'string')) {
        return -1;
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        return 0;
      } else {
        return 1;
      }
    };

    for (let index = 0; index < keys.length; index++) {
      const breakpoint = keys[index];
      this.allInterfaceProps.responsive[breakpoint] = fromPairs(
        Object.entries(this.allInterfaceProps.responsive[breakpoint]).sort(
          sortTwoProps
        )
      );
    }

    this.allInterfaceProps = fromPairs(
      Object.entries(this.allInterfaceProps).sort(sortTwoProps)
    );
  }
}

export default TypeGenerator;
