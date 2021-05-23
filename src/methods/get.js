import Node from '../Node';

export default function get(path = 'root') {
  this.previousPath = this.currentPath;
  if (/\./.test(path)) this.currentPath = path;
  else {
    if (path === 'root') this.currentPath = path;

    const idx = this.currentPath ? this.currentPath.lastIndexOf(path) : -1;

    if (idx !== -1) {
      this.currentPath = this.currentPath.substr(0, idx + path.length);
    } else {
      this.currentPath = `${this.currentPath || 'root'}.${path}`;
    }
  }
  const node = new Node(this.currentPath, this);
  this.nodes.add(this.currentPath, node);

  return this;
}
