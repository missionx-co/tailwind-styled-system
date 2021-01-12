import numWords from 'num-words';

export function lowerFirstLetter(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function capitalizeFirstLetter(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function toCamelCase(name) {
  if (typeof name !== 'string') return '';

  name = name.replace(/^\d/, numWords(name.match(/^\d/)) + '_');

  let nameArr = name.split('-');

  if (!Array.isArray(nameArr)) return name;

  return nameArr
    .map((item, index) => {
      if (index > 0) return capitalizeFirstLetter(item);
      else return item;
    })
    .join('');
}
