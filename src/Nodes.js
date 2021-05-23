export default class Nodes {
  constructor() {
    this.nodes = new Map();
  }

  add(path, val) {
    if (!this.nodes.has(path)) {
      this.nodes.set(path, val);
    }
  }

  clear() {
    this.nodes.clear();
  }

  delete(path) {
    this.nodes.delete(path);
  }

  get(path) {
    return this.nodes.get(path);
  }

  nodes() {
    return this.nodes;
  }

  size() {
    return this.nodes.size;
  }
}
