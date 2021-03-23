import flatMapDeep from 'lodash/flatMapDeep';
import merge from 'lodash/merge';

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

export function twStyleToClassName(props: any): string {
  if (!props) return '';

  return flatten(props).join(' ');
}

export function mergeTwStyleObjects(twStyle1: any = {}, twStyle2: any = {}) {
  // second parameter is the dominant side

  const customUtilities1 = twStyle1?.customUtilities;
  const customUtilities2 = twStyle2?.customUtilities;

  const newCustomUtilities = !(
    Array.isArray(customUtilities1) || Array.isArray(customUtilities2)
  )
    ? undefined
    : [...(customUtilities1 || []), ...(customUtilities2 || [])];

  const newTwStyle = merge({}, twStyle1, twStyle2);

  newTwStyle['customUtilities'] = newCustomUtilities;

  return newTwStyle;
}
