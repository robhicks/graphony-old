export default function on(cb) {
  this.events.on(this.currentPath, cb);
  return this;
}
