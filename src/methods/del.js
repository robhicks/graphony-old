export default function del() {
  this.nodes.delete(this.currentPath);
  return this;
}
