import { isArray } from '../utils/isArray';
import { uuid } from '../utils/uuid';
import Node from '../Node';

export default function set(value) {
  const currentNode = this.nodes.get(this.currentPath);
  (async (val) => {
    try {
      if (isArray(val)) {
        await currentNode.setValue([]);
        const temp = [];
        val.forEach((v) => {
          const ref = `ref:${uuid()}`;
          const path = `${this.currentPath}.${ref}`;
          const newNode = new Node(path, this);
          this.nodes.add(path, newNode);
          newNode.setValue(v);
          temp.push(ref);
        });
        await currentNode.setValue(temp);
      } else {
        await currentNode.setValue(val);
      }
    } catch (err) {
      // eat it
    }
  })(value);
  return this;
}
