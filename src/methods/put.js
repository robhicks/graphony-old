import { copy } from '../utils/copy';

export default function put(val) {
  const node = this.nodes.get(this.currentPath);
  // eslint-disable-next-line prefer-destructuring
  const value = node.value;
  const nVal = copy(val);
  // const v = { ...value, ...nVal, ...{ action: 'PUT' } };
  let v = Object.assign(value, nVal);
  v = { value: v, action: 'PUT' };

  // console.log('v', v);
  node.value = v;
  return this;
}
