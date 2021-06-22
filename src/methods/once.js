export default function once(callback = Function) {
  const cb = (val) => {
    callback(val);
    this.events.off(this.currentPath, cb);
  };
  this.events.on(this.currentPath, cb);

  return this;
}
