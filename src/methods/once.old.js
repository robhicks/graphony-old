import { isArray } from '../utils/isArray';

export default function once(callback = Function) {
  const node = this.nodes.get(this.currentPath);
  if (node) {
    this.store.get(node.path).then((storedValue) => {
      let value = node?.value || storedValue?.value;
      if (typeof value === 'undefined') value = null;

      if (isArray(value)) {
        if (this.filters.has(this.currentPath)) {
          value = this.filters.get(this.currentPath);
          this.filters.del(this.currentPath);
        } else {
          value = value.map((v) => {
            const path = v;
            const n = this.nodes.get(path);
            const vl = n.value;
            return vl;
          });
        }
      }
      callback(value);
    });
  } else {
    callback(null);
  }

  return this;
}
