import { copy } from '../utils/copy';

export default function put(val) {
  const node = this.nodes.get(this.currentPath);
  (async () => {
    try {
      const value = await node.getValue();
      const nVal = copy(val);
      const v = { ...value, ...nVal };
      await node.setValue(v);
    } catch (err) {
      // eat it
    }
  })();

  return this;
}
