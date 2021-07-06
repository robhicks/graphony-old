import { isArray } from '../utils/isArray';
import { uuid } from '../utils/uuid';
import Node from '../Node';

export default function set(value) {
  const currentNode = this.nodes.get(this.currentPath);

  if (isArray(value)) {
    currentNode.value = [];
    const temp = [];
    value.forEach((v) => {
      const path = `ref:${uuid()}`;
      const newNode = new Node(path, this);
      this.nodes.add(path, newNode);
      newNode.value = v;
      temp.push(path);
    });
    currentNode.value = temp;
  } else {
    currentNode.value = value;
  }
  return this;
}
