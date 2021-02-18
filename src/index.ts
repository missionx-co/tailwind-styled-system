import flatMapDeep from 'lodash/flatMapDeep';

const flatten = (obj = {}) => {
  if (typeof obj !== 'object') return [];

  const valuesArr = Object.entries(obj).map(item => {
    if (Array.isArray(item[1]) || typeof item[1] === 'string') {
      return item[1];
    } else if (typeof item[1] === 'object') {
      return flatten(item[1]);
    }
  });

  return flatMapDeep(valuesArr) || [];
};

export function twStyle(props: any): string {
  if (!props) return '';

  return flatten(props).join(' ');
}