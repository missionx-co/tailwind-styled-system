export function TailwindPropsToClasses(props: any): string {
  if (!props) return '';

  let classes = '';
  let newClasses = '';
  const keys = Object.keys(props);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key.match(/^tw_/)) continue;

    const val = props[key];
    if (!val) continue;

    if (typeof val === 'string') {
      newClasses = val;
    } else if (Array.isArray(val)) {
      newClasses = val.join(' ');
    } else if (typeof val === 'object' && key.includes('responsive')) {
      const values = Object.values(val);
      newClasses = values.join(' ');
    }

    classes = classes.concat(` ${newClasses}`);
  }
  classes = classes.trim();
  return classes;
}
