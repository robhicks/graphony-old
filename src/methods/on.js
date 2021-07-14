export default function on(cb) {
  (async () => {
    try {
      const node = this.nodes.get(this.currentPath);
      const url = this.rpcUri.query.set({ path: this.currentPath }).toString();
      const serverVal = await this.rpcClient.request(url);
      const value = { ...serverVal, ...{ action: 'SERVER_GET' } };
      // console.log('serverVal', value);
      node.value = value;
    } catch (error) {
      console.error('error', error);
    }
  })();
  this.wsc.subscribe({ path: this.currentPath, gid: this.uuid });
  this.events.on(this.currentPath, cb);
  return this;
}
