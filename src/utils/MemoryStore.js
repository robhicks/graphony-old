export class MemoryStore {
  constructor() {
    this.db = new Map();
  }

  clear() {
    this.db = new Map();
  }

  async del(path) {
    this.db.delete(path);
  }

  async get(path) {
    return this.db.get(path);
  }

  async put(path, value) {
    return this.db.set(path, value);
  }
}
