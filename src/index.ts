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

/**
 * merge twStyle objects
 * this function accomulate customUtilities for each twStyle object and merges the other properties of twStyle objects.
 * @param twStyleObjects any
 * @returns any
 */
export function mergeTwStyleObjects(...twStyleObjects) {
  const allCustomUtilitiesMerged = twStyleObjects.reduce((acc, twStyleObject) => {
    if (
      twStyleObject
      && Array.isArray(twStyleObject.customUtilities)
      && twStyleObject.customUtilities.length > 0
    ) {
      return [...acc, ...twStyleObject.customUtilities]
    }
    return acc
  }, [])

  const twStyle = merge({}, ...twStyleObjects)
  twStyle.customUtilities = allCustomUtilitiesMerged
  return twStyle
}

/**
 * merge the provided twStyle objects and convert the result twStyle object into tailwind classnamse
 * @param twStyleObjects any
 * @returns string
 */
export default function twStyleToClassName(...twStyleObjects): string {
  if (twStyleObjects.length === 0) {
    return '';
  }

  const props = mergeTwStyleObjects(...twStyleObjects)
  return flatten(props).join(' ');
}
