import {isArray} from './isArray';

export function isDiff(obj) {
  let answer = false;
  if (isArray(obj) && obj.length > 0) {
    if (obj[0].op) answer = true;
  }
  return answer;
}
