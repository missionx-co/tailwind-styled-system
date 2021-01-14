export default function TailwindPropsToClasses(props): string {
  if (!props) return '';

  let classes = '';
  const keys = Object.keys(props);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key.match(/^tw_/)) continue;

    const val = props[key];
    if (!val) continue;

    if (typeof val === 'string') {
      classes = classes.concat(` ${val}`);
    } else if (typeof val === 'object' && key.includes('responsive')) {
      const breakpoints = Object.keys(val);

      for (let j = 0; j < breakpoints.length; j++) {
        const breakpoint = breakpoints[j];
        const resClass = val[breakpoint];
        classes = classes.concat(` ${resClass}`);
      }
    }
  }

  classes = classes.trim();
  return classes;
}

const testObj1 = {};
const testObj2 = undefined;
const testObj3 = {
  name: 'test',
  onClick() {},
  id: 'tets',
  tw_backgroundColor: 'bg-white',
  backgroundColor: 'bg-black',
  test_tw_backgroundColor: 'test',
  tw_textColor: 'text-blue-900',
  tw_test: { sm: 'test' },
  tw_responsiveDivideWidth: { sm: 'sm:test', md: 'md:test' },
};

console.log(TailwindPropsToClasses(testObj1));
console.log(TailwindPropsToClasses(testObj2));
console.log(TailwindPropsToClasses(testObj3));
