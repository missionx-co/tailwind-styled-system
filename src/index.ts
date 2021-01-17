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
