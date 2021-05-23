import { isArray } from '../utils/isArray';

export default function once(callback = Function) {
  const node = this.nodes.get(this.currentPath);
  (async (cb) => {
    try {
      let value = await node.getValue();
      if (isArray(value)) {
        if (this.filters.has(this.currentPath)) {
          value = this.filters.get(this.currentPath);
          this.filters.del(this.currentPath);
        } else {
          value = await Promise.all(value.map(async (v) => {
            const path = v.includes('root.') ? v : `${this.currentPath}.${v}`;
            const n = this.nodes.get(path);
            const vl = await n.getValue();
            return vl;
          }));
        }
      }
      return cb(value);
    } catch (err) {
      return err;
    }
  })(callback);

  return this;
}
