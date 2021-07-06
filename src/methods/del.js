export default function del() {
  const node = this.nodes.get(this.currentPath);
  node.value = { action: 'DELETE' };

  return this;
}
