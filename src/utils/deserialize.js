import { isJson } from './isJson';

export const deserialize = (str) => isJson(str) || {};
