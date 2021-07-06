import { noop } from '../utils/noop';

export default function on(cb) {
  this.store.get(this.currentPath).then((val) => {
    if (val) {
      const node = this.nodes.get(this.currentPath);
      node.value = val;
    }
  });
  this.rpcClient.request(this.rpcUri.query.set({ path: this.currentPath }).toString())
    .then((val) => {
      if (val) {
        const node = this.nodes.get(this.currentPath);
        node.value = val;
      }
    })
    .catch(noop);
  this.wsc.load({ path: this.currentPath, gid: this.uuid });
  this.wsc.subscribe({ path: this.currentPath, gid: this.uuid });
  this.events.on(this.currentPath, cb);
  return this;
}
