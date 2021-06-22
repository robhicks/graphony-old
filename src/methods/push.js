import { isArray } from '../utils/isArray';
import Node from '../Node';
import { isString } from '../utils/isString';
import { uuid } from '../utils/uuid';

export default function push(val) {
  const node = this.nodes.get(this.currentPath);
  // eslint-disable-next-line prefer-destructuring
  const value = node.value;
  if (isString(val) && val.includes('.')) {
    value.push(val);
    node.value = value;
  } else if (!isArray(value)) {
    throw Error('cannot push into non-array');
  } else {
    const ref = `ref:${uuid()}`;
    const newNode = new Node(ref, this);
    this.nodes.add(ref, newNode);
    newNode.value = val;
    value.push(ref);
    node.value = value;
  }
  return this;
}
