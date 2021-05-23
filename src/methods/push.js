import { isArray } from '../utils/isArray';
import Node from '../Node';
import { uuid } from '../utils/uuid';

export default function push(val) {
  const node = this.nodes.get(this.currentPath);
  (async () => {
    try {
      const value = await node.getValue();
      if (!isArray(value)) throw Error('cannot push into non-array');
      const ref = `ref:${uuid()}`;
      const path = `${this.currentPath}.${ref}`;
      const newNode = new Node(path, this);
      this.nodes.add(path, newNode);
      await newNode.setValue(value);
      value.push(ref);
      return node.setValue(val);
    } catch (err) {
      return err;
    }
  })();
  return this;
}
