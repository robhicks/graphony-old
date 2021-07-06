export default function once(callback = Function) {
  const node = this.nodes.get(this.currentPath);
  try {
    if (node) {
      Promise.all([
        this.store.get(node.path),
        this.rpcClient.request(this.rpcUri.query.set({ path: this.currentPath }).toString()),
      ]).then(([localData, remoteData]) => {
        const combined = { ...localData, ...remoteData };
        callback(combined.value);
      }).catch(() => {
        this.store.get(node.path).then((localData) => callback(localData.value));
      });
    } else {
      callback(null);
    }
  } catch (error) {
    callback(error);
  }

  return this;
}
