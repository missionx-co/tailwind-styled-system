import merge from 'lodash/merge';
import TailwindProcessor from '../tailwindcss/TailwindProcessor';
import fromPairs from 'lodash/fromPairs';
import variants from '../tailwindcss/variants';

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
